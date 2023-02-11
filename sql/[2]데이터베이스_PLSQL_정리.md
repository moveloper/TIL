# 데이터베이스 PL/SQL 정리

[PL/SQL 코드 생성과 실행](#plsql-코드-생성과-실행)

[다중 로우 처리 4+1가지 방법(FETCH와 BULK COLLECT INTO)](#다중-로우-처리-4+1가지-방법(FETCH와-BULK-COLLECT-INTO))

## PL/SQL 코드 생성과 실행

PL/SQL 문 입력이 끝났음을 SQL *Plus 에 알리기 위해, 마지막에 슬래시(/) 를 입력해야 한다.
대개 피해를 주진 않지만, 슬래시는 중요한 특징이 몇 가지 있다.
1. 슬래시는 SQL 이든 PL/SQL  이든 상관없이 "가장 최근에 입력된 문장을 실행하라" 는 뜻이다.
2. SQL*Plus  에서 슬래시는 유일한 명령어로서, PL/SQL 이나 SQL 의 일부분이 아니다.
3. 슬래시 자체가 한 행에 나와야 한다
4. 오라클 9i 하위버전의 SQL*Plus 에서 공백을 슬래시 앞에 입력하면 작동하지 않는다.
```
SQL*Plus의 PL/SQL 사용자는 EXECUTE 명령어를 사용하면
BEGIN , END, 마지막에 붙이는 슬래시를 입력하지 않아도 된다.

원문 SQL >
BEGIN
DBMS_OUTPUT.PUT_LINE('hey look')
END;
/

SQL > EXECUTE DBMS_OUTPUT.PUT_LNE('hey look')

EXECUTE 는 축약될 수 있고, 대소문자를 가리지 않기 때문에, 다음처럼 사용 할 수 있다.

SQL > exec dbms_output.put_line('hey look')
```
### 스크립트 실행
스크립트 파일명을 알고 있다면 '@' 명령어를 사용하는 것이 스크립트를 실행하는 가장 손쉬운 방법이다. '@' 명령어는 sqlplus를 실행시킨 디렉토리가 기준이다.
```
SQL> @파일이름.확장자명

SQL> START 파일이름.확장자명
@ = START 의 실행결과는 동일하다.

스크립트 파일이 다른 디렉토리에 있으면 파일명을 경로와 함께 쓰면 된다.
SQL> @/파일경로A/파일경로B/파일이름.확장자명

@@ - 현재 실행되는 파일의 디렉토리에서 상대적으로 파일을 찾아라

SQLPLUS try to do @script at current location/directory. But @@script at the same directory of main SQL script. 
-------------------------------------
### main.sql ###
#location: /home/sqlplus
@file1
@@file1
-------------------------------------
### file1.sql ###
#location: /home
-------------------------------------
### file1.sql ###
#location: /home/sqlplus
-------------------------------------

#When I DOING script at /home
sqlplus -s system/manager @/home/sqlplus/main.sql
@file1 => /home/file1.sql (current directory)
@@file1 => /home/sqlplus/file1.sql (same with main.sql)
```

### 세션 SET값 조회 
```
SQL> SHOW ALL
```

### AUTOCOMMIT
```
기본값을 AUTOCOMMIT ON 으로 ,
ON - 커밋되지 않은 변경사항을 커밋한다.
OFF - 커빗되지 않은 변경사항을 롤백 한다.
SQL>SET AUTOCOMMIT OFF[ON]
```
### DISCONNECT
```
연결된 상태로 데이터베이스와의 연결을 끊고 싶은 경우
SQL>DISCONNECT
``` 

## 다중 로우 처리 4+1가지 방법(FETCH와 BULK COLLECT INTO)

정적 SQL이든 동적 SQL이든 한 개 이상의 결과를 반환하는 SELECT문의 결과 집합을 받아 오기 위해 필요한 것은 세가지다.
=> 커서, 결과를 받아오는 커서나 레코드변수, 반복문 
=> BULK COLLECT INTO가 성능면에서 좋다.

```sql
-- 출처: https://thebook.io/006696/part03/ch13/02/02/
-- 1) FETCH
DECLARE
    -- 커서 타입 선언
    TYPE query_physicist IS REF CURSOR;
    -- 커서 변수 선언
    myPhysicist query_physicist;
    -- 반환 값을 받을 레코드 선언
    empPhysicist ch13_physicist%ROWTYPE;

    vs_sql VARCHAR2(1000);
BEGIN
    vs_sql := 'SELECT * FROM ch13_physicist';
    -- OPEN FOR문을 사용한 동적 SQL
    OPEN myPhysicist FOR vs_sql;
    --루프를 돌며 커서 변수에 담긴 값을 출력한다.
    LOOP
    FETCH myPhysicist INTO empPhysicist;
    EXIT WHEN myPhysicist%NOTFOUND;
    DBMS_OUTPUT.PUT_LINE(empPhysicist.names);
    END LOOP;
    --커서를 닫는다
    CLOSE myPhysicist;
END;

-- 2) FETCH + 바인드 변수
DECLARE
    -- 커서 변수 선언
    myPhysicist SYS_REFCURSOR;
    -- 반환 값을 받을 레코드 선언
    empPhysicist ch13_physicist%ROWTYPE;

    vs_sql VARCHAR2(1000);
    vn_id    ch13_physicist.ids%TYPE    := 1;
    vs_names ch13_physicist.names%TYPE  := 'Albert%';

BEGIN
    -- 바인드 변수 사용을 위해 WHERE조건 추가
    vs_sql := 'SELECT * FROM ch13_physicist WHERE IDS > :a AND NAMES LIKE :a ';
    -- OPEN FOR문을 사용한 동적 SQL
    OPEN myPhysicist FOR vs_sql USING vn_id, vs_names;

    --루프를 돌며 커서 변수에 담긴 값을 출력
    LOOP
    FETCH myPhysicist INTO empPhysicist;
    EXIT WHEN myPhysicist%NOTFOUND;
    DBMS_OUTPUT.PUT_LINE(empPhysicist.names);
    END LOOP;

    CLOSE myPhysicist;
END;

-- 3) 정적 SQL + BULK COLLECT INTO
DECLARE
    -- 레코드 선언
    TYPE rec_physicist IS RECORD  (
    ids ch13_physicist.ids%TYPE,
    names ch13_physicist.names%TYPE,
    birth_dt ch13_physicist.birth_dt%TYPE );

    -- 레코드를 항목으로 하는 중첩 테이블 선언
    TYPE NT_physicist IS TABLE OF rec_physicist;

    -- 중첩 테이블 변수 선언
    vr_physicist NT_physicist;
BEGIN
    -- BULK COLLECT INTO절(패치가 한 번에 이루어 진다)
    SELECT *
    BULK COLLECT INTO vr_physicist
    FROM ch13_physicist;
    -- 루프를 돌며 출력(이 루프는 값을 패치하는 것이 아니라 출력하기 위한 루프임)
    FOR i IN 1..vr_physicist.count
    LOOP
    DBMS_OUTPUT.PUT_LINE(vr_physicist(i).names);
    END LOOP;
END; 

-- 4) 동적 SQL + BULK COLLECT INTO
DECLARE
    -- 레코드 선언
    TYPE rec_physicist IS RECORD  (
    ids ch13_physicist.ids%TYPE,
    names ch13_physicist.names%TYPE,
    birth_dt ch13_physicist.birth_dt%TYPE );
    -- 레코드를 항목으로 하는 중첩 테이블 선언
    TYPE NT_physicist IS TABLE OF rec_physicist;

    -- 중첩 테이블 변수 선언
    vr_physicist NT_physicist;

    vs_sql VARCHAR2(1000);
    vn_ids ch13_physicist.ids%TYPE := 1;
BEGIN
    -- SELECT 구문
    vs_sql := 'SELECT * FROM ch13_physicist WHERE ids > :a' ;

    -- EXECUTE IMMEDIATE .. BULK COLLECT INTO 구문
    EXECUTE IMMEDIATE vs_sql BULK COLLECT INTO vr_physicist USING vn_ids;

    -- 루프를 돌며 출력
    FOR i IN 1..vr_physicist.count
    LOOP
    DBMS_OUTPUT.PUT_LINE(vr_physicist(i).names);
    END LOOP;

END;

-- 세상 간편한 방법
DECLARE
    BEGIN
        FOR ITEM IN 
        (
            SELECT 'DATA' AS VAL FROM DUAL
        )
        LOOP
        DBMS_OUTPUT.PUT_LINE(ITEM.VAL);
    END LOOP;
END;

```
