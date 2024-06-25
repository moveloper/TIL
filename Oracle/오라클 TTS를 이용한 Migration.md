# 오라클 TTS를 이용한 Migration
- 서로 다른 DB 사이의 데이터를 주고받는 가장 효율적인 방법
- 데이터 파일을 먼저 옮기고 메타데이터(구조)만 import하는 방식
- SYSTEM, SYSAUX, UNDO, TEMP 테이블스페이스는 지원안됨 
- 원본 데이터베이스와 타겟 데이터베이스의 캐릭터셋이 동일해야 함
- 이동할 테이블스페이스를 EXPORT 하기 전에 READ ONLY 상태로 변경해야함

```sql
/* 캐릭터셋 확인 */
select property_name, property_value 
from database_properties 
where property_name like 'NLS_CHA%';

/* 테이블 스페이스 생성 */
create tablespace tbs_01 datafile 'tbs_01.dbf' size 4m;
create tablespace tbs_02 datafile 'D:\APP\SOON\PRODUCT\11.2.0\DBHOME_1\DATABASE\tbs_02.DBF' size 4m;

select * from dba_data_files; -- 생성된 테이블 스페이스 확인

/* 테이블 생성 */
create table scott.emp_test tablespace tbs_01 as select * from scott.emp; 
create table scott.dept_test tablespace tbs_02 as select * from scott.dept;

/* PK, FK 추가 */
alter table scott.dept_test add constraint dept_test_pk primary key(deptno);
alter table scott.emp_test add constraint emp_test_fk foreign key(deptno) references scott.dept_test(deptno);

/* dbms_tts 패키지를 활용해 테이블 스페이스가 transportable한지 검사 */
desc dbms_tts; 

begin
  dbms_tts.transport_set_check(
    ts_list => 'tbs_01, tbs_02',
    incl_constraints => true
  );
end;
-- PL/SQL procedure successfully completed.

select * from transport_set_violations; -- 검사한 결과 조회 

-- ORA-39908: SCOTT.DEPT_TEST_PK 인덱스(USERS 테이블스페이스에 있음)가 기본 제약 조건 (SCOTT.DEPT_TEST 테이블, TBS_02 테이블스페이스에 있음)을(를) 강제 수행합니다.

-- pk는 자동으로 index가 생성되기 때문에, 앞서 dept_test 테이블에 pk를 만들면서 인덱스가 생성되었다. 해당 인덱스는 default tablespace인 USERS 테이블 스페이스에 생성되어 만약 이 상태로 테이블스페이스를 이동하면 인덱스의 누락이 발생한다. 따라서 index의 rebuild 작업이 필요하다
alter index scott.dept_test_pk rebuild tablespace tbs_02;

-- 테이블 스페이스 공간이 모자라 ora-01659 오류 발생시 아래와 같이 수행한다
alter tablespace tbs_02 add datafile 'tbs_02_01.dbf' size 5m autoextend on maxsize unlimited;

-- 다시 검사후 조회되는 행이 없으면 진행한다 

/* 테이블 스페이스를 read only로 변경 */
alter tablespace tbs_01 read only;
alter tablespace tbs_02 read only;

/* 디렉토리 생성 및 권한 부여*/
create or replace directory dir_dump as 'D:\APP\SOON\PRODUCT\11.2.0\DBHOME_1\DATABASE';
GRANT READ, WRITE ON DIRECTORY dir_dump to system;

/* Data Pump export를 이용하여 2개의 테이블 스페이스에 대한 metadata를 추출한다 */
expdp system/비밀번호 dumpfile=tts_test.dmp directory=dir_dump transport_tablespaces=tbs_01,tbs_02 -- tbs_01, tbs_02 사이에 공백이 있으면, tbs_01만 읽어들인건지 "ORA-39906: EMP_TEST_FK 제약 조건이 SCOTT.DEPT_TEST 테이블(TBS_02 테이블스페이스에 있음)과 SCOTT.EMP_TEST 테이블(TBS_01  테이블스페이스에 있음) 간에 있습니다." 에러가 발생함 

/* dumpfile과 3개의 데이터파일을 타겟 데이터베이스로 이동시킨다 */
-- scp, sftp 등을 활용해 타겟 데이터베이스로 이동. 실습은 로컬에서 테스트 해볼거라 데이터 파일은 D:\tts_test로 복사하고 덤프파일은 impdp의 directory 영역에 복사한다.
tts_test.dmp -- impdp의 directory 영역
tbs_01.dbf -- D:\tts_test
tbs_02.dbf -- D:\tts_test
tbs_02_01.dbf -- D:\tts_test

-- 로컬에서 테스트하기 때문에 데이터파일을 D:\tts_test에 백업해 두고 테이블 스페이스 삭제
drop tablespace tbs_01 including contents and datafiles;
drop tablespace tbs_02 including contents and datafiles;

/* 추출한 metadata를 import */
impdp system/비밀번호 dumpfile=tts_test.dmp directory=dir_dump transport_datafiles=D:\tts_test\tbs_01.dbf,D:\tts_test\tbs_02.dbf,D:\tts_test\tbs_02_01.dbf

/* 조회 */
select * from scott.emp_test;
```