# 데이터베이스 SQL 정리

[ORA-01417: A TABLE MAY BE OUTER JOINED TO AT MOST ONE OTHER TABLE (11g 버전에서)](#ora-01417-a-table-may-be-outer-joined-to-at-most-one-other-table-11g-버전에서)

[3개 이상 테이블을 OUTER JOIN 할 때 ](#3개-이상-테이블을-outer-join-할-때)

[ORDER BY 절이 사용되지 않는 SELECT 쿼리(MySQL)](#order-by-절이-사용되지-않는-select-쿼리mysql)

[SELECT한 쿼리의 결과로우 수가 매번 다르게 나오는 상황](#select한-쿼리의-결과로우-수가-매번-다르게-나오는-상황)

[dbms_xplan.display_cursor 를 SQL DEVELOPER에서 사용할 때 발생했던 문제](#dbms_xplandisplay_cursor-를-sql-developer에서-사용할-때-발생했던-문제)

[관계성이 없는 임시테이블끼리 조인할 때 생각해야할 것들..](#관계성이-없는-임시테이블끼리-조인할-때-생각해야할-것들)

[TO_CHAR로 숫자를 변환할 때 공백이 생기는 이유와 해결방법](#to_char로-숫자를-변환할-때-공백이-생기는-이유와-해결방법)

[OUTER JOIN 시 착각하기 쉬운 것 2가지](#outer-join-시-착각하기-쉬운-것)

[MERGE INTO](#merge-into)

[ORA-29275: partial multibyte character와 DB LINK](#ora-29275-partial-multibyte-character와-db-link)

[클라이언트와 서버의 날짜/인코딩 포맷 관련](#클라이언트와-서버의-날짜인코딩-포맷-관련)

[CREATE TABLE .. AS SELECT (CTAS)시 주의할점](#create-table--as-select-ctas시-주의할점)

[오라클 날짜,  시간 차이 계산 방법](#오라클-날짜--시간-차이-계산-방법)

[CASE문과 NULL](#case문과-null)

[COUNT(*), COUNT(1), COUNT(컬럼), COUNT(DISTICT 컬럼)](#count-count1-count컬럼-countdistict-컬럼)

[CASE 함수와 ORDER BY로 특정 값 우선정렬하기](#case-함수와-order-by로-특정-값-우선정렬하기)

[Why DECODE can only be used in sql statement](#why-decode-can-only-be-used-in-sql-statement) 

[오라클 NULL](#오라클-null)

[NVL 함수](#nvl-함수)

[VALIDATE_CONVERSION 함수 (오라클 12c R2 이상)](#validate_conversion-함수-오라클-12c-r2-이상)

[INSERT INTO ... SELECT문에서 주의할 점](#insert-into--select문에서-주의할-점)

[DISTINCT와 ROWNUM](#distinct와-rownum)

[GROUP BY 없이 단독으로 HAVING이 오는 경우](#group-by-없이-단독으로-having이-오는-경우)

[중첩 서브쿼리 사용시 몰랐던 점](#중첩-서브쿼리-사용시-몰랐던-점)

[LEVEL을 WHERE절에서 활용한 쿼리](#level을-where절에서-활용한-쿼리)

[REGEXP_SUBSTR 사용법](#regexp_substr-사용법)

[정규표현식](#정규표현식)

[오라클에 엔터(줄바꿈) 입력 및 제거](#오라클에-엔터줄바꿈-입력-및-제거)

[SQL 표현식 우선순위 규칙](#sql-표현식-우선순위-규칙)

[그룹핑함수](#그룹핑함수)

[GROUPING SETS 함수와 ROLLUP, CUBE](#grouping-sets-함수와-rollup-cube)

[pivot과 unpivot](#pivot과-unpivot)

[CUBE 함수](#cube-함수)

[계층형 질의](#계층형-질의)

[WITH절](#with절)

[PRIMARY KEY 삭제시 유의할 점](#primary-key-삭제시-유의할-점)

[PRIMARY KEY 생성하는 여러가지 방법](#primary-key-생성하는-여러가지-방법)

[WHERE 1=1 사용이유](#where-11-사용이유)

[Join Update(조인 업데이트) 방법 (DBMS 별 구문 비교)](#join-update조인-업데이트-방법-dbms-별-구문-비교)

[dbms_xmlgen 패키지를 활용하기](#dbms_xmlgen-패키지를-활용하기)

[cross join할 때 조인하려는 테이블에 데이터가 없을 경우](#cross-join할-때-조인하려는-테이블에-데이터가-없을-경우)

[LISTAGG(여러 행을 하나의 컬럼으로 만들기) 활용하기](#listagg여러-행을-하나의-컬럼으로-만들기-활용하기)

## ORA-01417: A TABLE MAY BE OUTER JOINED TO AT MOST ONE OTHER TABLE (11g 버전에서)
원인: 한 테이블에 최대 OUTER JOIN은 한 개 이상이 되면 안됨
```
WITH TEST1 AS(
SELECT '1' NO, '1A' VAL FROM DUAL
UNION ALL
SELECT '2' NO, '1B' VAL FROM DUAL
UNION ALL
SELECT '3' NO, '1C' VAL FROM DUAL
UNION ALL
SELECT '4' NO, '1D' VAL FROM DUAL
UNION ALL
SELECT '5' NO, '1E' VAL FROM DUAL
)
,
TEST2 AS (
SELECT '1' NO, '2A' VAL FROM DUAL
UNION ALL
SELECT '3' NO, '2B' VAL FROM DUAL
UNION ALL
SELECT '5' NO, '2C' VAL FROM DUAL
UNION ALL
SELECT '7' NO, '2D' VAL FROM DUAL
UNION ALL
SELECT '9' NO, '2E' VAL FROM DUAL
)
,
TEST3 AS(
SELECT '1' NO, '3A' VAL FROM DUAL
UNION ALL
SELECT '4' NO, '3B' VAL FROM DUAL
UNION ALL
SELECT '5' NO, '3C' VAL FROM DUAL
UNION ALL
SELECT '9' NO, '3D' VAL FROM DUAL
UNION ALL
SELECT '11' NO, '3E' VAL FROM DUAL
UNION ALL
SELECT '13' NO, '3F' VAL FROM DUAL
)
SELECT * 
FROM TEST1 A
   , TEST2 B
   , TEST3 C
WHERE A.NO = B.NO(+)
  AND C.NO = B.NO(+);
```
19C 버전에서는 위 쿼리가 실행 가능하다.
```
1.      A.NO = B.NO(+)  
    AND B.NO = C.NO(+)  
   => A, B OUTER JOIN => 결과테이블과 C OUTER JOIN

2. A LEFT OUTER JOIN B   
     ON A.NO = B.NO  
     LEFT OUTER JOIN C  
     ON B.NO = C.NO 
   => A, B OUTER JOIN => 결과테이블과 C OUTER JOIN (1번과 동일)

3.     A.NO = B.NO(+)
   AND C.NO = B.NO(+)
   => A, C 카타시안곱 !! => 결과테이블, B OUTER JOIN  
   => 1, 2번과 같은 결과라고 착각했으나 전혀 다른 결과가 
```
## 3개 이상 테이블을 OUTER JOIN 할 때 
```
WITH TAB1 AS(
SELECT '1' COL1, '1' COL2 FROM DUAL
UNION ALL
SELECT '2' COL1, '2' COL2 FROM DUAL
UNION ALL
SELECT '3' COL1, '3' COL2 FROM DUAL
)
,
TAB2 AS (
SELECT '1' COL1, '1' COL2 FROM DUAL
UNION ALL
SELECT '1' COL1, '1' COL2 FROM DUAL
UNION ALL
SELECT '1' COL1, '1' COL2 FROM DUAL
UNION ALL
SELECT '2' COL1, '2' COL2 FROM DUAL
UNION ALL
SELECT '2' COL1, '2' COL2 FROM DUAL
UNION ALL
SELECT '2' COL1, '2' COL2 FROM DUAL
)
,
TAB3 AS(
SELECT '2' COL1, '2' COL2 FROM DUAL
UNION ALL
SELECT '3' COL1, '3' COL2 FROM DUAL
)

1)
SELECT *
FROM TAB1 A
   , TAB2 B
   , TAB3 C
WHERE A.COL1 = B.COL1(+)
  AND A.COL1 = C.COL1(+)

1	1	1	1	- -	
1	1	1	1	- -
1	1	1	1	- -
2	2	2	2	2	2
2	2	2	2	2	2
2	2	2	2	2	2
3	3	- -	3	3

2)
SELECT *
FROM TAB1 A
   , TAB2 B
   , TAB3 C
WHERE A.COL1 = B.COL1(+)
  AND B.COL1 = C.COL1(+)

2	2	2	2	2	2
2	2	2	2	2	2
2	2	2	2	2	2
3	3	- - - -
1	1	1	1	- -
1	1	1	1	- -
1	1	1	1	- -

3) 
SELECT *
FROM TAB1 A
   , TAB2 B
   , TAB3 C
WHERE A.COL1 = B.COL1(+)
  AND B.COL1 = C.COL1

2	2	2	2	2	2
2	2	2	2	2	2
2	2	2	2	2	2

1번 쿼리는 TAB1을 TAB2와 조인한 결과테이블에서 TAB1 기준으로 다시 TAB3과 조인하여 결과를 가져온다.   
2번 쿼리는 TAB1을 TAB2와 조인한 결과테이블에서 TAB2 기준으로 다시 TAB3과 조인하여 결과를 가져온다.  
3번 쿼리는 오라클에서 TAB2와 TAB3를 먼저 조인하고 그 결과테이블에서 TAB1과 조인하여 결과를 가져온다.  
```

## ORDER BY 절이 사용되지 않는 SELECT 쿼리(MySQL) 
```
ORDER BY 절이 사용되지 않는 SELECT 쿼리의 결과의 정렬순서는 다음과 같다.

- 인덱스를 사용한 SELECT의 경우에는 인덱스의 정렬된 순서대로 레코드를 가져온다.

- 인덱스를 사용하지 못하고 풀 테이블 스캔을 실행하는 SELECT의 경우, MyISAM은 테이블 저장된 순서대로 가져오는데, 순서가 INSERT 순서를 이믜하는 것은 아니다. 레코드가 삭제되면서 빈 공간이 생기면 INSERT 되는 레코드는 항상 테이블의 마지막이 아니라 빈 공간 이있으면 빈 공간에 저장되기 때문이다. InnoDB의 경우 항상 프라이머리 키로 클러스터링 돼어 있기 때문에 풀 테이블 스캔의 경우 기본적으로 프라이머리 키 순서대로 레코드를 가져온다.

- SELECT 쿼리가 임시 테이블을 거쳐서 처리되면 조회되는 레코드의 순서는 예측하기는 어렵다. 
ORDER BY 절이 없는 SELECT 쿼리 결과의 순서는 처리 절차에 따라 달라질 수 있다. 어떤 DBMS도 ORDER BY 절이 명시되지 않은 쿼리에 대해서는 어떠한 정렬도 보장하지 않는다. 
ORDER BY에서 인덱스를 사용하지 못할 대는 추가적인 정렬 작업을 수행하고, 쿼리 실행 계획이 있는 Extra 컬럼에 Using filesort 라는 코멘트가 표시된다. Filesort라는 단어에 포함된 File은 디스크의 파일을 이용해 정렬을 수행한다는 의미가 아니라 쿼리를 수행하는 도중에 MySQL 서버가 퀵 소트 정렬 알고리즘을 수행했다는 의미 정도로 이해하면 된다. 정렬 대상이 많은 경우 여러 부분으로 나눠서 처리하는데, 정렬된 결과를 임시로 디스크나 메모리에 저장해둔다. 실제로 메모리만 이용해 정렬이 수행됐는지 디스크의 파일을 이용했는지는 알 수 없다.
```


## SELECT한 쿼리의 결과로우 수가 매번 다르게 나오는 상황 
- 원인: FROM 절의 인라인 뷰에서 ROW_NUMBER() OVER (PARTITION BY 컬럼명 ORDER BY 컬럼명)을 사용하고 ROWNUM = 1 조건으로 데이터를 가져왔는데, ORDER BY 절에 같은 값이 많아 순서가 일정하지 않은 결과를 가져오게 되었다. 결과값이 일정하지 않다보니 이 인라인뷰와 조인할 때마다 조인에 성공하는 로우수가 달랐던 것이다.
- 해결: ORDER BY 절에 명확하게 순서를 나눌 수 있는 컬럼을 추가해서 매번 같은 결과값을 보장할 수 있도록 수정하였다. 

## dbms_xplan.display_cursor 를 SQL DEVELOPER에서 사용할 때 발생했던 문제
원인은 잘 모르겠으나, SQL DEVELOPER에서 해당 패키지 사용시 `cannot fetch plan for SQL_ID` 에러가 발생하였다. 같 은 쿼리를 몇 번 날리면 가끔 성공적으로 결과를 불러올 때도 있는데 아닐 때도 있는 상황. 해결방안으로 `set serveroutput off` 하면 된다. 추측하건데, dbms_xplan.display_cursor 사용시 set serveroutput on 일 때 충돌나는 코드가 있는 것 같다. 
 

## 관계성이 없는 임시테이블끼리 조인할 때 생각해야할 것들..
데이터 이관업무를 하면서 한 가지 어려웠던 점은 테이블끼리 관계가 설계되어있지 않은 테이블들끼리 조인을 하는 것이었다. 물리적으로 1:1, 1:M, N:M 관계가 설정된 것이 아니기 때문에 조인했을 때 결과를 예측할 수 있어야 했다. 예를 들면 A와 B 테이블의 논리적 관계가 M:1일 때, B테이블의 pk와 같이 유니크한 컬럼과 조인을 하면 A테이블이 100건 일 때, 조인되는 결과값도 100건일 것이다. 그 다음 A와 C테이블이 조인할 때 1:M 관계라고 해보자. A의 pk 컬럼으로 C의 유니크하지 않은 컬럼과 조인한다면 그 결과는 M건이 발생한다(A테이블 100건, C테이블 120건이면 모두 조인된다고 했을 때 120건이 됨). 하지만 C의 pk는 유니크하다. 반면에 A의 유니크하지 않은 컬럼과 C의 유니크하지 않은 컬럼끼리 조인을 하게 되면, M:N관계가 되어 중복에 따라 C와 조인에 성공하는 로우도 중복되게 된다. 따라서 결과 값을 보면 C의 pk는 유니크하지 않게 된다(A테이블의 2건이 1건의 C와 조인될 수 있다)
```
pk1  pk2  col        pk1  pk2  col1  col2  col3
 1    1    가         A    B    1     1     다
 1    2    다         A    C    1     1     다
 1    3    다         A    D    1     3     다 

B테이블 pk가 unique
 A.pk1 = B.col1
 A.pk2 = B.col2 

B테이블 pk가 non unique
 A.col1 = B.col3
```

## TO_CHAR로 숫자를 변환할 때 공백이 생기는 이유와 해결방법

숫자를 문자로 변환할 때 가장 많이 사용하는 함수. TO_CHAR    
가끔 변환된 문자열앞에 공백이 붙는경우가 있음.    
이유는 숫자인 경우 양수는 공백, 음수는 '-'가 붙는다.     
없애는 방법은 형식에 'FM'을 넣으면 해결.     

```sql
SELECT TO_CHAR(999, '000') FROM DUAL; -- 결과 ' 999'
SELECT TO_CHAR(999, 'FM000') FROM DUAL; -- 결과 '999'
SELECT TRIM(TO_CHAR(999, '000')) FROM DUAL; -- 결과 TRIM(' 999')
```

또 하나 주의할 점은 NUMBER타입을 CHAR타입 컬럼에 INSERT 할 때도 공백이 생기는 것이다. 예를 들면 CHAR(10) 컬럼에 숫자 3을 INESRT하면 '3         '로 자동 형변환이 되어 의도하지 않은 결과를 가져온다. 반면 VARCHAR(10) 컬럼럼에 INSERT하면 사용한 데이터 크기 만큼만 차지하므로 '3'으로 INSERT 된다. 

## OUTER JOIN 시 착각하기 쉬운 것
1. OUTER JOIN을 하게되면 뭔가 DRIVING TABLE의 ROW 수가 100건이면 100건의 결과만 나와야 될 것 같은 착각을 했다. <u>LEFT OUTER JOIN을 기준으로 1:M의 관계인 경우, 결과 집합의 내용은 LEFT 기준이지만 결과집합의 건수는 RIGHT가 기준이다</u>. 즉 내용은 DRIVING TALBE의 100건에 해당하는 내용이 모두 존재하고, 만약 DRIVEN TABLE에 여러 행이 조건에 일치한다면 100 + a 의 결과 건수가 되는 것이다. INNER JOIN 시에는 건수에 신경안쓰다가, OUTER JOIN 시에 왠지 건수가 기준 테이블 건수와 같아야 된다는 잘못된 생각을 했다. 
2. WHERE 절의 조인 조건에 아래와 같은 구문이 있었다 
   ```sql
    FROM TABLE1 A
       , TABLE2 B
   WHERE A.COL1 = B.COL1(+)
     AND NVL(A.COL2, 'X') = NVL(B.COL2(+), 'X');

   -- ANSI로 
    FROM TABLE1 A
    LEFT JOIN TABLE2 B
      ON A.COL1 = B.COL1
     AND NVL(A.COL2, 'X') = NVL(B.COL2, 'X');   
   ```
   처음에 볼 때는 '아우터 조인한 결과가 NULL일 때 'X'로 비교하는건가?'하고 헷갈렸는데 조인에 대한 이해가 모자라서였다. ANSI로 풀었을 때 비로소 이해가 되었다. 테이블 A와 테이블 B가 아우터 조인하는데, 그 조인 컬럼으로 A.COL1과 B.COL1의 일치여부와 A.COL2와 B.COL2의 일치여부를 기준으로 한다. 다만, A.COL2와 B.COL2가 NULL이라면 'X'로 값을 치환한 뒤에 조인을 실시한다.    

## MERGE INTO 
https://gent.tistory.com/406
```
주의할 점
1. SQL 오류: ORA-38104: ON 절에서 참조되는 열은 업데이트할 수 없음: "A"."JOB"
38104. 00000 -  "Columns referenced in the ON Clause cannot be updated: %s"
2. UPDATE 후 DELETE문은 <MATCHED 된 데이터를 대상>으로 한다. 
```
## ORA-29275: partial multibyte character와 DB LINK
```
상황: INSERT INTO 티베로TABLE SELECT * FROM 오라클TABLE@DBLINK 시 위와 같은 오류가 발생함. 오라클은 KO16MSWIN949, 티베로는 UTF8.
의문점1: 똑같이 한글이 들어있는 컬럼인데도 정상적으로 INSERT되는 이유가 궁금
해결1: DB LINK 사용시 데이터베이스가 자동으로 문자 집합 변환을 수행해서 정상적으로 입력된 값들은 문제가 없었던 것
의문점2: 한글 때문에 바이트 크기가 커져서 정상적으로 컬럼에 INSERT가 안되는 상황임에도 에러 메시지가 다양한 이유가 궁금. 컬럼명과 초과한 바이트 수를 명확히 보여주는 경우, 컬럼명을 알려주지 않고 단순히 길이가 초과했다고만 알려주는 경우, 위와 같이 멀티바이트 오류인 경우가 있었다. 
해결2: 추측컨데 멀티바이트 오류는 변환 값을 알 수 없는 정크/보이지 않는 문자가 Oracle 데이터에 있는 경우 발생하는 것으로 보임. 즉 변환 자체가 불가능한 경우로 추측. 
다른 두 가지 경우는 데이터 문자집합은 변환 했으나, 데이터를 INSERT 처리하는 과정중에 각각 특정한 로직을 수행하다가 서로 다른 오류를 뱉어낸 것으로 추측된다.    
```

## 클라이언트와 서버의 날짜/인코딩 포맷 관련
```
상황: 로컬 pc의 디비버에서 서버에 INSERT-SELECT 하거나 SP를 수행하면 문제없이 되었다. 반면 서버 pc의 SQLPLUS에서 SP를 수행하면 ORA-01843 지정한 월이 부족하다는 메시지가 발생하였다. 
의문점: 클라이언트의 날짜/인코딩 포맷에 따라 데이터 변환이 다른가?

해결: 다르다. SP나 스크립트를 클라이언트 또는 서버에서 직접 쿼리를 수행하면 각각의 클라이언트/서버의 포맷에 따르게 된다. 같은 SP나 INSERT-SELECT라도 클라이언트 기준에 맞춰 데이터가 변환되기 때문이다. 테이블에 들어가는 데이터의 인코딩/날짜 포맷은 제약이 없기 때문에, 클라이언트/서버에 각각 설정된 타입으로 데이터가 삽입된다. 그리고 들어간 데이터를 읽을 때 클라이어트/서버에 설정된 타입과 다르게 되면 깨져보이는 등과 같은 현상이 발생하게 된다. 예를들면 UTF8인 클라이언트가 데이터를 삽입했는데, 해당 데이터를 KO16MSWIN949인 클라이언트가 읽는 상황. 

ORA-01861: literal does not match format string 에러도 같은 맥락에서 발생할 수 있다. 분명 내 로컬PC의 INSERT-SELECT 문에서는 잘 수행되던게, 서버의 SQLPLUS에서 수행하면 위와 같은 오류메시지를 출력한다. 일단 원인은 TO_DATE, TO_CHAR 함수에서 형식을 지정하지 않아서 발생하는 문제인데, 만약 클라이언트와 서버의 환경이 같았다면 같은 기본값을 이용해 변환될 것이기 때문에 에러가 발생하지 않을 수도 있다. 하지만 클라이언트 서버는 'YYYY-MM-DD' 형태가 기본으로 설정된 값이고 서버는 'DD-MON-RR' 형식이 기본값이라면, 형식을 명시해주지 않으면 각 환경의 기본값으로 TO_DATE, TO_CHAR 함수를 실행하기 때문에 주어진 인수에 따라 오류가 발생하게 된다.     
참고: https://m.blog.naver.com/jeemin5/220141590502
```


## CREATE TABLE .. AS SELECT (CTAS)시 주의할점 
SELECT절에서 SUBSTR 함수나 TO_CHAR 함수같이 데이터를 가공해서 CREATE TABLE 하는 경우에 데이터베이스 엔진(추측컨데 DB의 CHARACTER SET에 따라)에 의해 원하지 않는 길이의 형태로 테이블이 생성될 수 있다. 실무에서 SUBSTR('41110')은 VARCHAR2(10)으로 변환되고, TO_CHAR(NUMBER 타입의 컬럼, 길이 20) 인 경우에는 VARCHAR(40)으로 테이블이 생성되었다. 또한 검색하다보니 DB LINK를 사용했을 때도 컬럼길이가 달라지는 현상이 있다고 한다. 명확한 컬럼 길이로 CTAS 하고 싶다면, CAST 함수를 사용해서 만들어야 한다. 


## 오라클 날짜,  시간 차이 계산 방법
```sql

날짜 차이 : 종료일자(YYYY-MM-DD) - 시작일자(YYYY-MM-DD)
시간 차이 : (종료일시(YYYY-MM-DD HH:MI:SS) - 시작일시(YYYY-MM-DD HH:MI:SS)) * 24
분 차이 : (종료일시(YYYY-MM-DD HH:MI:SS) - 시작일시(YYYY-MM-DD HH:MI:SS)) * 24 * 60
초 차이 : (종료일시(YYYY-MM-DD HH:MI:SS) - 시작일시(YYYY-MM-DD HH:MI:SS)) * 24 * 60 * 60

종료일자에서 시작일자를 빼면 차이 값이 '일' 기준의 수치 값으로 반환된다.
계산된 값을 시, 분, 초로 변환하기 위해서는 환산값(24*60*60)을 곱해주어야 한다.

SELECT TO_DATE('2021-05-08', 'YYYY-MM-DD') - TO_DATE('2021-05-01', 'YYYY-MM-DD')
FROM dual

결과: 7
```
## CASE문과 NULL
```
SELECT CASE WHEN NULL IS NULL THEN 'A' ELSE 'B' END // A
FROM DUAL

SELECT CASE NULL WHEN NULL THEN 'A' ELSE 'B' END // B
FROM DUAL

아래 쿼리처럼 CASE의 조건문이 NULL = NULL로 처리가 되므로 'A'가 아닌 'B'를 반환한다.
NULL = NULL은 FALSE
```

## COUNT(*), COUNT(1), COUNT(컬럼), COUNT(DISTICT 컬럼)  
```
COUNT(컬럼명)을 사용하면 해당 컬럼의 NULL값은 제외하고 COUNT 한다.  
COUNT(*)을 사용하면 NULL도 포함하여 전부 COUNT 한다. COUNT(1), COUNT(77) 등과 같은 의미
COUNT(DISTINCT 컬럼명)은 해당 컬럼에서 중복된 데이터를 제거하고 개수를 세어 결과를 출력한다 
```
## CASE 함수와 ORDER BY로 특정 값 우선정렬하기 
```
SELECT *
FROM 주문테이블
ORDER BY (CASE WHEN 주문상태 = '배송완료' THEN 1 ELSE 9 END ), 주문일자 ASC;

주문상태 컬럼을 기준으로 배송완료이면 1순위로 거짓이면 2순위로 정렬한다. 그 이후에 주문일자순으로 오름차순으로 정렬한다. 직관적으로 이해한려고 한다면, 주문상태 컬럼에서 값이 배송완료인 값은 1로 치환하고 나머지 값은 9로 치환한 후 오름차순으로 정렬한다고 생각하면 된다. CASE WHEN 주문상태 = '배송완료' THEN '가' ELSE '나' END 로 표현한다면, 배송완료는 '가'로 치환되고 나머지는 '나'로 치환하기 때문에 1과 2로 치환한 것과 같은 결과를 보여준다.  
```

## Why DECODE can only be used in sql statement
decode was implemented by Oracle to allow "if then else" type determination inside SQL statements.

it wasn't needed in PL because PL already had IF THEN ELSE as part of the language.

Since then CASE has become an ANSI standard for SQL, so CASE is now implemented in both SQL and PL.

That's just the way it is.
```sql
declare
x pls_integer;
A pls_integer :=0;
begin
  x := case A when 0 then 0 else 1 end; -- work
  x := decode (A,0,0,1) ; -- doesn't work
  dbms_output.put_line(x);
end;
```




## 오라클 NULL
1. 오라클에서 빈 문자열('')은 NULL로 인식하기 때문에, 컬럼의 값이 빈 문자열이면 NULL과 동일한 조건으로 쿼리를 작성해야 한다.
반면 MySQL이나 SQLserver에서는 빈 문자열이 그대로 입력된다.
2. NULL 값이 존재하는 컬럼에서 WHERE 조건에 <> '3' 과 같은 조건을 걸면 NULL인 컬럼은 SELECT 되지 않는다. 마찬가지로 INNER JOIN에 사용되는 컬럼에 NULL 값이 존재하면 JOIN 되지 않는다.

## NVL 함수
주의할 점: 조사할 컬럼과 치환할 값의 데이터 타입이 같아야 한다. 

## VALIDATE_CONVERSION 함수 (오라클 12c R2 이상)
```SQL
SELECT VALIDATE_CONVERSION('2021-07-08' AS DATE, 'YYYY-MM-DD')
  FROM dual
날짜형식이 맞으면 1을, 틀리면 0을 반환한다. 
주의할 점은 NULL 값을 넣어도 1이 반환되기 때문에, NOT NULL 컬럼에서 
CASE WHEN VALIDATE_CONVERSION('NULL포함된컬럼' AS DATE, 'YYYY-MM-DD') = 1 THEN 'NULL포함된컬럼' ELSE TO_CHAR(SYSDATE, 'YYYY-MM-DD') END 와 같이 조건을 준다면 NULL 값으로 변환되어 버리게 되므로 주의하자.  
```

## INSERT INTO ... SELECT문에서 주의할 점
```
1. INSERT INTO ... SELECT 문에서 SELECT 절에 별칭은 의미가 없다. 
INSERT INTO 테이블 
SELECT '1' PK3, '2' PK1, '3' PK3 FROM DUAL
-- 결과 
PK1 PK2 PK3
 1   2   3


2. INSERT 절에 컬럼을 명시한다면, 명시된 컬럼 순서대로 INSERT 된다. 여기서도 SELECT 절의 별칭은 의미가 없다. 
-- 쿼리
INSERT INTO TABLE 
(PK2, PK3, PK1)
SELECT '1번' AS PK1
     , '2번' AS PK2
     , '3번' AS PK3
  FROM DUAL 
-- 결과 
PK1 PK2 PK3
3번 1번 2번 

3. 테이블에 default 값이 설정되어 있다고 생략하면 안된다. 
INSERT INTO TEST_TAB 
SELECT '1' 
     , '2'
  FROM DUAL ;
-- 결과
ORA-00947: 값의 수가 충분하지 않습니다  

참조: https://stackoverflow.com/questions/29421094/insert-into-using-a-query-and-add-a-default-value 
```

## DISTINCT와 ROWNUM
SELECT 다음에 DISTINCT가 이뤄지기 때문에 WHERE ROWNUM <= 1000이라는 조건을 주고 SELECT 된 값중에 중복값이 존재한다면, 1000개 이하의 데이터가 출력된다. 

## GROUP BY 없이 단독으로 HAVING이 오는 경우
GROUP BY와 HAVING은 짝꿍이라고 생각했다. HAVING이 주로 GROUP BY절 뒤에 오는 것은 맞지만, 그렇지 않은 경우도 존재한다. 만약 테이블 전체가 한 개의 그룹이 되는 경우 GROUP BY 없이 단독으로 HAVING을 사용할 수 있다. 
```sql
SELECT COUNT(*) "전체 행수", COUNT(HEIGHT) "키 건수", 
        MAX(HEIGHT) 최대키, MIN(HEIGHT) 최소키, 
        ROUND(AVG(HEIGHT),2) 평균키 
FROM PLAYER;
HAVING MAX(HEIGHT) > 170
```

## 중첩 서브쿼리 사용시 몰랐던 점
```
SELECT A.COL1
  FROM TAB1 A
 WHERE A.CO1 IN (SELECT A.COL1 
                  FROM TAB2 B)
중첩서브쿼리로 필터링하는 쿼리를 만들다가 잘못하여 바깥쪽 컬럼을 서브쿼리의 SELECT 절에 두어 사용했는데, 오류가 발생하지 않아서 잘못하면 그냥 넘길뻔한 경우가 있었다. 
중첩서브쿼리 안에서 바깥쪽 테이블의 컬럼을 SELECT 절에 두어도 오류가 발생하지 않는다(FROM절 -> WHERE절 순으로 동작하기 때문). 또한 TAB2를 그저 스캔만 할 뿐이다.
```

## LEVEL을 WHERE절에서 활용한 쿼리
```sql
-- TABLE.COL1 공백제거 전과 후의 길이 차이에 따라, LEV로 뻥튀기된 데이터의 개수를 조절해서 가져옴.  
SELECT A.COL1
     , A.COL2
     , A.COL3
     , ROW_NUMBER() OVER(PARTITION BY A.COL1, A.COL2 ORDER BY LEV) AS RUNM 
     , REGEXP_SUBSTR(A.COL3, '[^ ]+', 1, LEV) AS PK
  FROM TABLE1 A
     , (SELECT LEVEL AS LEV FROM DUAL CONNECT BY LEVEL <= 10>)
 WHERE LEV <= LENGTH(A.COL1) - (LENGTH(REPLACE(A.COL1, ' ')) + 1) 
```
## REGEXP_SUBSTR 사용법 
```SQL
/*
REGEXP_SUBSTR(COLUMN, [REG_EXP], [START_INDEX], [GROUP_INDEX])
REG_EXP
  대괄호 [] 안의 ^ 는  NOT의 의미를 나타냄
  ^ 문자가 대괄호 밖에서 사용되면 문자열의 시작을 의미함
  + 는 문자패턴이 1개이상 연결될 때를 나타냄, 위 예제에서 01,03등 2개이상 나타내기 위함
  
START_INDEX
  검색의 시작지점 
GROUP INDEX
  잘려진 그룹이 2개 이상이라면 GROUP INDEX에 해당하는 그룹을 출력한다
*/  
SELECT REGEXP_SUBSTR('C123-456-789','[^-]+',1,1) FROM DUAL;
 결과 = C123
SELECT REGEXP_SUBSTR('C123-456-789','[^-]+',1,2) FROM DUAL;
 결과 = 456
SELECT REGEXP_SUBSTR('C123-456-789','[^-]+',1,3) FROM DUAL;
 결과 = 789
SELECT REGEXP_SUBSTR('C123-456-789','[^-]+',3,1) FROM DUAL;
 결과 = 23
SELECT REGEXP_SUBSTR('C123-456-789','[^-]+',7,1) FROM DUAL;
 결과 = 56
SELECT REGEXP_SUBSTR('C123-456-789','[^-]+',7,2) FROM DUAL;
 결과 = 789
SELECT REGEXP_SUBSTR('C123-456-789','[-]+',1,1) FROM DUAL;
 결과 = -
SELECT REGEXP_SUBSTR('C123-456-789','[-]+',1,2) FROM DUAL;
 결과 = -
SELECT REGEXP_SUBSTR('C123-456-789','[-]+',1,3) FROM DUAL;
 결과 = NULL
```

## 정규표현식 
정리된 블로그:   
https://gent.tistory.com/546  
https://hamait.tistory.com/m/342  

  - 추가: [역참조에 대한 개념] http://minsone.github.io/regex/regexp-backreference

## 오라클에 엔터(줄바꿈) 입력 및 제거
```
오라클에 데이터를 넣을 때, 다양한 데이터가 들어갈 수 있지만 textarea와 같은 곳에 들어간 내용은 줄바꿈이 필요할 경우가 있다.

기본적으로 개행을 삽입하기 위해서 아래와 같이 표현할 수 있다.

UPDATE 테이블 명
SET '안녕'||CHR(13)||CHR(10)||'하세요'
WHERE 조건

결과값 : 
안녕
하세요

*) CHR()은 숫자를 아스키코드로 변환해주는 함수이며,
CHR(13) : carriage return(캐리지 리턴) > 현재 라인의 첫 번째 자리에 커서를 위치
CHR(10) : new line(라인 피트) > 커서 위치를 아래쪽으로 이동
각각 위와 같은 의미를 가지고 있으므로 현재 라인 첫번째 자리에서 아래로 커서가 이동하여 '\n'과 같은 줄바꿈을 확인할 수 있다.

반대로 개행을 제거하기 위해서는 아래와 같이 replace를 이용하여 처리할 수 있다.
replace(컬럼명, CHR(13) || CHR(10), '')
replace(replace(컬럼명, CHR(10), ''), CHR(13), '')

출처: https://highello.tistory.com/m/20 
```

## SQL 표현식 우선순위 규칙
```
1. 산술 연산자. ( + - / * ... )
2. 연결 연산자. ( || ... )
3. 비교 조건. ( < > = ... )
4. IS [NOT] NULL, LIKE, [NOT] IN
5. [NOT] BETWEEN
6. NOT 논리 조건
7. AND 논리 조건
8. OR 논리 조건

1) SELECT 1 OR 0 AND 0;
-- 1
2) SELECT 1 OR (0 AND 0);
-- 1
3) SELECT (1 OR 0) AND 0;
-- 0
4)
SELECT user_id , user_mobile , user_gender , user_amount  , user_addr 
FROM  User_Table
WHERE user_gender  = 'male'
OR user_amount   >= 5500
AND user_addr  IS NULL;
  --- > (user_amount가 5500이면서 user_addr이 null) 이거나 user_gender가 male인 데이터를 추출하겠다는 뜻. 아래 쿼리와 같은 뜻이다
  SELECT user_id , user_mobile , user_gender , user_amount  , user_addr 
FROM  User_Table
WHERE user_gender  = 'male'
OR (user_amount   >= 5500
AND user_addr  IS NULL) ;
```
AND와 OR을 활용해 WHERE절에서 if-else구문처럼 활용할 수도 있다. 참고: https://lifere.tistory.com/m/entry/MSSQL-SQL%EC%9D%98-where-%EC%A0%88%EC%97%90%EC%84%9C-if%EB%AC%B8-if-else%EB%AC%B8%EC%B2%98%EB%9F%BC-%EC%82%AC%EC%9A%A9%ED%95%98%EA%B8%B0?category=435176

## 그룹핑함수
ROLLUP: https://gent.tistory.com/57
CUBE: https://gent.tistory.com/385
GROUPING SETS: https://gent.tistory.com/279
GROUPING, GROUPING_ID: https://gent.tistory.com/386
```SQL
SELECT EMPNO, SAL , SUM(SAL)
FROM EMP
GROUP BY ROLLUP(EMPNO, SAL)
HAVING GROUPING(EMPNO) = 1 OR GROUPING(SAL) = 0;

7900	950  	950
7369	800  	800
7499	1600	1600
7521	1250	1250
7566	2975	2975
7654	1250	1250
7698	2850	2850
7782	2450	2450
7788	3000	3000
7839	5000	5000
7844	1500	1500
7876	1100	1100
7902	3000	3000
7934	1300	1300
NULL    NULL    29025 

SELECT EMPNO, SAL, SUM(SAL), GROUPING(EMPNO), GROUPING_ID(EMPNO, SAL)
FROM EMP
GROUP BY CUBE(EMPNO, SAL);

EMPNO	 SAL	SUM(SAL)	GROUPING(EMPNO)	GROUPING_ID(EMPNO,SAL)
                  29025	            1	         3
         800	   800	            1	         2
         1100	   1100	            1	         2
         1300	   1300	            1	         2
         1500	   1500	            1	         2
         1600	   1600	            1	         2
```

## GROUPING SETS 함수와 ROLLUP, CUBE
> GROUPING SETS과 GRUOPING 함수에 대해 정리가 깔끔하게 잘되어 있다: https://gent.tistory.com/279

오라클에서 소계, 합계, 총계의 쿼리(SQL)를 작성할 때는 ROLLUP을 많이 사용한다. ROLLUP의 경우 나열된 컬럼의 단계별로 소계, 합계를 자동으로 집계를 한다. 그에 반해 GROUPING SETS는 여러 그룹핑 쿼리를 UNION ALL 한 것과 같은 결과를 만들 수 있어 조금 더 유연하게 소계, 합계를 집계할 수 있다.

composite column 문의 경우|  group by 문의 경우 
---|---
group by grouping sets(a,b,c)| group by a union all group by b union all group by c 
group by grouping sets(a,b,(b,c))|  group by a union all group by b union all group by b,c 
group by grouping sets((a,b,c)) | group by a,b,c
group by grouping sets(a,(b),()) | group by a union all group by b union all group by ()
group by grouping sets(a,rollup(b,c)) | group by a union all group by rollup(b,c)
group by rollup(a,b,c) | group by (a,b,c) union all group by (a,b) union all group by (a) union all group by () 
group by cube(a,b,c) | group by (a,b,c) union all group by (a,b) union all group by (a,c) union all group by (b,c) union all group by (a) union all group by (b) union all group by (c) union allgroup by ()
---

* GROUPING 함수는 해당 컬럼의 값이 NULL이면 1, 값이 있으면 0을 리턴 한다.


## pivot과 unpivot
> https://wookoa.tistory.com/240

 주의: 피봇은 FROM 절에 걸어준 테이블의 모든 컬럼 중 PIVOT 절에 기술한 컬럼을 제외하고 모두 GROUP BY 해버린다

## CUBE 함수
```
SELECT A.ID, B.CODE, B.QUAN, SUM(B.QUAN)
FROM A INNER JOIN B
ON A.ID = B.ID
GROUP BY CUBE(A.ID, B.CODE, (B.CODE, B.QUAN))
ORDER BY A.ID, B.CODE, B.QUAN;
```


|ID	|    CODE|	     QUAN |   SUM(B.QUAN)|
|---|---|---|---|
|1	 |ELECTRO |   100	  | 100     |    
|1	 |ELECTRO|   100	  | 100     | 
|1	 |ELECTRO|    - 	  | 100     | 
|1	 |WATER	 |   200	  | 200
|1	 |WATER 	 |200	     | 200
|1	 |WATER	 |    - 	  | 200
|1	 |WIND	 |   300	  | 300
|1	 |WIND	 |   300	  | 300
|1	 |WIND	 |   - 	  |    300
|1	 | - 	    |-  	     | 600
|2	 |ELECTRO|   200	  | 200
|2	 |ELECTRO|   200	  | 200
|2	 |ELECTRO|    - 	  | 200
|2	 |WATER	 |   300	  | 300
|2	 |WATER	 |   300	  | 300
|2	 |WATER	 |    -  	|  300
|2	 | - 	    | - 	     |500
|3	 |ELECTRO|   300	  | 300
|3	 |ELECTRO|   300	  | 300
|3	 |ELECTRO|    - 	  | 300
|3	 | - 	    | - 	     |300
|- |   ELECTR|   100	  | 100
|- |   ELECTR|   100	  | 100
|- |   ELECTR|   200	  | 200
|- |   ELECTR|   200	  | 200
|- |   ELECTR|   300	  | 300
|- |   ELECTR|   300	  | 300
|- |   ELECTR|    - 	  | 600
|- |   WATER|      200|	   200
|- |   WATER|      200|	   200
|- |   WATER|      300|	   300
|- |   WATER|      300|	   300
|- |   WATER|       - |	   500
|- |   WIND	 |   300	  | 300
|- |   WIND	 |   300	  | 300
|- |   WIND	 |    - 	  | 300
|- |    - 	 |    - 	  | 1400


이린식으로 쿼리가 있을 때 CUBE 함수는 모든 경우의 수를 출력하고(위에서는 2^3 = 8가지 케이스) 각각의 소계를 출력해준다고 생각하면 된다. 여기서 (B.CODE, B.QUAN)가 이해가 안되었는데, A.ID를 A, B.CODE를 B, B.QUAN을 C라고 했을 때 조합이 (A,B,(B,C)), (A,B), (B,(B,C)), ((B,C), A), (A), (B), ((B,C)), () 이다. 여기서 (A,B,(B,C)), (B,(B,C)), ((B,C), A), ((B, C))에 B가 중복되어 같은 데이터가 테이블로 출력되는 것처럼 보인다. 그러나 인간이 보기에는 같은 데이터일지는 몰라도 오라클은 B와 (B, C)를 독립적인 컬럼으로 인식하고 각각을 중복되지 않는 데이터로 인식하기 때문에 위와같이 중복되는 행들이 출력되는 것이다. 때문에 (A,<u>**B**</u>,(B,C)) 와 ((<u>**B**</u>,C), A) 총계는 중복된 것처럼 보여 두 번씩 나타나고 있고, 마찬가지로 (B,(B,C))와 ((B,C)) 총계 역시 두 번 나타나는 거슬 볼 수 있다. 같은 통계인 것처럼 보이지만 사실 각각 다른 통계를 나타내는 것이다


## 계층형 질의
* START WITH절을 통해 지정된 계층구조가 전개될 시작 데이터를 파악한다.
* PRIOR 사원 = 매니저(이전 레벨의 사원값을 매니저값으로 가지고 있는, 부모->자식 순방향 전개)  
PRIOR 매니저 = 사원(이전 레벨의 매니저값을 사원값으로 가지고 있는, 자식->부모 역방향 전개)
* PRIOR은 SELECT, WHERE절에서도 사용가능하다. *그냥 PRIOR 키워드를 이전에 참조하고 있는 데이터행이라고 치환해서 생각해버리자.*
* 조건이 어느 절에 기재되어 있느냐에 따라
  * CONNECT BY 절에 작성된 조건: START WITH 절에서 필터링된 시작데이터는 결과목록에 포함되며, 이후 하위데이터도 전개되지만 조건을 충족하지 않는 하위 데이터는 결과에서 제외된다. 
  * PRIOR 조건에 추가된 조건: START WITH 절에서 필터링된 시작데이터는 결과목록에 포함되며, <u>*PRIOR조건을 모두 만족하는 경우에만 하위데이터가 전개된다*</u>. PRIOR조건을 모두 만족시키지 않는 경우 하위데이터 자체가 전개 안됨
* WHERE절에 작성된 조건: 계층구조를 모두 전개한 후 조건을 충족하는 데이터만 결과목록에 출력된다.
 
reference)  
https://valuableinfo.tistory.com/entry/%EC%98%A4%EB%9D%BC%ED%81%B4-%EA%B3%84%EC%B8%B5%EC%BF%BC%EB%A6%AC-%EB%91%90%EB%B2%88%EC%A7%B8-CONNECT-BY-PRIOR


## WITH절 
WITH절은 복잡한 SQL에서 동일 블록에 대해 반복적으로 SQL문을 사용하는 경우 그 블록에 이름을 부여하여 재사용 할 수 있게 함으로서 쿼리 성능을 높일 수 있는데 WITH절을 이용하여 미리 이름을 부여해서 Query Block을 만들 수 있다. 자주 실행되는 경우 한번만 Parsing되고 Plan 계획이 수립되므로 쿼리의 성능향상에 도움이 된다.
```sql
WITH EXAMPLE AS
(
 SELECT 'WITH절' AS STR1
 FROM DUAL
)

SELECT * FROM EXAMPLE
```

## PRIMARY KEY 삭제시 유의할 점
ALTER TABLE 테이블명 DROP PRIMARY KEY; 구문을 사용할 때 주의할 점이 있다. PRIMARY KEY를 생성하는 방법에 따라 제약조건과 인덱스 모두가 삭제 될 때가 있고, 제약조건만 삭제되고 인덱스는 그대로 남아 있는 경우가 발생하기도 한다. PRIMARY KEY를 생성할 때 인덱스와 제약조건을 동시에 생성하면 삭제할 때도 동시에 삭제가 되고, 이미 생성된 인덱스를 사용해서 PRIMARY KEY를 생성하면, 위 구문 수행시 제약조건만 삭제가 되고 인덱스는 남아있는다.    
이미 운영중인 시스템에서 PRIMARY KEY를 삭제 및 변경해야 한다면 아래와 같이 명시해서 작업하는 것이 바람직하다. 
```
1. 인덱스와 제약조건을 한번에 삭제
ALTER TABLE 테이블명 DROP PRIMARY KEY DROP INDEX;
2. 제약조건만 삭제하고 인덱스를 남겨놓고 싶을 때
ALTER TABLE 테이블명 DROP PRIMARY KEY KEEP INDEX;
```

## PRIMARY KEY 생성하는 여러가지 방법
1. 테이블 생성 시 제약 조건 생성 
```
CREATE TABLE TEST1( COL1 NUMBER 
                  , COL2 NUMBER 
                  , CONSTRAINT PK_TEST1 PRIMARY KEY(COL1)
                  );
```
2. 유니크 인덱스 생성 후 PK로 지정
```
CREATE UNIQUE INDEX PK_TEST1 ON TEST1(COL1);
ALTER TABLE TEST1 ADD CONSTRAINTS PK_TEST1 PRIMARY KEY(COL1);
```
3. ALTER TABLE... ADD PRIMARY KEY 
```
PK명은 SYS*** 으로 생성됨
ALTER TABLE TEST_TABLE ADD PRIMARY KEY(USER_ID..)
 > 해당 컬럼으로 미리 만들어 둔 인덱스가 없는 경우: CONSTRAINT 명칭과 동일한 이름으로 인덱스 자동 생성 됨
 > 해당 컬럼으로 미리 만들어 둔 인덱스가 있는 경우: 해당 인덱스를 이용함, 별도 인덱스 생성 안함
```

## WHERE 1=1 사용이유
1. 쿼리 디버깅 시, 주석처리가 편하다.
2. 동적쿼리에서 특정상황마다 WHERE 절을 다르게줘야 할 때 편하다.
   ```
    SELECT * FROM EMPLOYEE
        IF A가 NULL이 아니면 
            WHERE EMPLOYEE_ID = A
        IF B가 NULL이 아니면
            IF A가 NULL이 아니면
                AND
            ELSE 
                WHERE
            EMPLOYEE_NAME = B

    SELECT * FROM EMPLOYEE WHERE 1=1
        IF A가 NULL이 아니면
            WHERE EMPLOYEE_ID = A
        IF B가 NULL이 아니면
            WHERE EMPLOYEE_NAME = B
   ```
## Join Update(조인 업데이트) 방법 (DBMS 별 구문 비교)

```sql
/*문제 : 사원테이블(emp)의 부서번호(deptno)에 해당하는 부서명(dname)을 부서테이블(dept)에서 찾아
       사원테이블(emp)의 부서명(dname)을 갱신하시오. */
 
-- Oracle --
-- 1. SubQuery 를 이용한 Update
UPDATE emp e
   SET e.dname = (SELECT d.dname FROM dept d WHERE d.deptno = e.deptno)
 WHERE EXISTS (SELECT 0 FROM dept d WHERE d.deptno = e.deptno)
;
-- 2. Updatable Join View 이용
--    단, d.deptno 가 반드시 PK 이어야 함
--    10G 까지는 PK 아니더라도 힌트로 제어 가능(/*+ bypass_ujvc */)
UPDATE /*+ bypass_ujvc */
       (SELECT e.dname
             , d.dname AS dname_new
          FROM emp  e
             , dept d
         WHERE d.deptno = e.deptno
        )
   SET dname = dname_new
;
-- 3. Merge
MERGE INTO emp e
USING dept d
ON (d.deptno = e.deptno)
WHEN MATCHED THEN
UPDATE SET e.dname = d.dname

-- MSSQL - From 절 사용 조인 --
UPDATE e
   SET e.dname = d.dname
  FROM emp e
 INNER JOIN dept d
    ON d.deptno = e.deptno

-- MySQL - Update 절에서 바로 조인 --
-- SET sql_safe_updates = 0;
UPDATE emp e
 INNER JOIN dept d
    ON d.deptno = e.deptno
   SET e.dname = d.dname
;

```

## dbms_xmlgen 패키지를 활용하기
dbms_xmlgen.getxmltype은 SQL을 입력받고 그 결과를 XMLTYPE으로 반환하는 함수이다. exatract는 XML 타입으로부터 값을 추출하는 함수이다. '//text()'는 XML의 태그를 제외한 값을 모두 추출한다. 
'//text()' 와 같이 표기하는 것을 'XPATH'라고 하는데, 아래 블로그에 잘 정리되어 있다. https://engineer-mole.tistory.com/162 
```sql
SELECT table_name
     , num_rows
     , TO_NUMBER(
       dbms_xmlgen.getxmltype('SELECT COUNT(*) c FROM ' || table_name).Extract('//text()')
       ) num_rows2 -- 실제측정 건수
  FROM dba_tables
;

/* dbms_xmlgen.getxmltype('SELECT COUNT(*) c FROM ' || TABLE_NAME) 의 결과값은 아래와 같다.
<ROWSET>
 <ROW>
  <C>2993</C>
 </ROW>
</ROWSET>

EXTRACT('//C/text()') = EXTRACT('//text()')

 XPath는 "//"를 이용하여 노드 패스를 생략할 수 있다. "//"는 descendant-or-self의 생략형이다. 즉 기점이 되는 노드의 모든 자식들의 집합을 일컫는다. 

SELECT  dbms_xmlgen.getxmltype('SELECT * FROM SCOTT.EMP').EXTRACT('//text()') FROM DUAL; 

결과는 루트노드의 모든 자식 집합들 중 텍스트 값만 추출한 것이다. 
7369SMITHCLERK79021980/12/17800207499ALLENSALESMAN76981981/02/201600300307521WARDSALESMAN76981981/02/221250500307566JONESMANAGER78391981/04/022975207654MARTINSALESMAN76981981/09/2812501400307698BLAKEMANAGER78391981/05/012850307782CLARKMANAGER78391981/06/092450107788SCOTTANALYST75661987/04/193000207839KINGPRESIDENT1981/11/175000107844TURNERSALESMAN76981981/09/0815000307876ADAMSCLERK77881987/05/231100207900JAMESCLERK76981981/12/03950307902FORDANALYST75661981/12/033000207934MILLERCLERK77821982/01/23130010

*/

```

## cross join할 때 조인하려는 테이블에 데이터가 없을 경우
inner join할 때 조인하는 테이블에 데이터가 없을 경우 결과는 출력되지 않는다. outer join일 경우는 조인을 시도하는 테이블의 데이터 수만큼 출력한다. cross join의 경우, 조인하려는 테이블에 데이터가 0건일 경우 조인을 시도하는 테이블의 데이터도 출력되지 않는다. 실무에서 이와 관련되서 당황했던 경험이 있어서 기록한다. 기존 코드에서 cross join 인데 oracle sql을 사용해 cross join인지 눈치채지 못한 상황이었고, 심지어 cross join의 대상이 되는 테이블에 where절에서 (+)기호를 사용해 마치 조인 조건처럼 적어둔 경우가 있엇다. 그래서 처음에는 outer join인 줄 알았다. 조인조건 없이 cross join하는 테이블에 (+)를 사용한 것은 outer join과 cross join을 동시에 하겠다는 모순된 상황이다.  


## LISTAGG(여러 행을 하나의 컬럼으로 만들기) 활용하기

```SQL
-- 아래는 같은 결과
SELECT DISTINCT LISTAGG(대상컬럼명, 구분자) WITHIN GROUP (ORDER BY 정렬기준컬럼) 
       OVER (PARTITION BY 구분하고자 하는 대상컬럼) AS LIST_NAME
  FROM 테이블명; -- DISTINCT가 없으면 테이블의 로우 수만큼 결과가 출력됨

SELECT 구분하고자 하는 대상 컬럼
     , LISTAGG(대상컬럼명, 구분자) WITHIN GROUP (ORDER BY 정렬기준컬럼) 
FROM 테이블명 
GROUP BY 구분하고자 하는 대상 컬럼

-- 정규표현식을 활용한 중복제거 
SELECT DISTINCT DEPT,
       REGEXP_REPLACE(LISTAGG(USER_NAME, ',') WITHIN GROUP (ORDER BY ORDER_NUMBER ASC)
       OVER (PARTITION BY DEPT),'([^,]+)(,\1)+', '\1') AS USER_NAME
  FROM TEST_TABLE

-- 테스트 쿼리 
WITH TEST_TABLE AS (
SELECT '인사부' AS DEPT, '홍길동' AS USER_NAME, 2 AS ORDER_NUMBER FROM DUAL
UNION ALL
SELECT '인사부' AS DEPT, '김길동' AS USER_NAME, 1 AS ORDER_NUMBER FROM DUAL
UNION ALL
SELECT '인사부' AS DEPT, '김길동' AS USER_NAME, 1 AS ORDER_NUMBER FROM DUAL
UNION ALL
SELECT '감사부' AS DEPT, '이길동' AS USER_NAME, 3 AS ORDER_NUMBER FROM DUAL)
SELECT DISTINCT DEPT,
       REGEXP_REPLACE(LISTAGG(USER_NAME, ',') WITHIN GROUP (ORDER BY ORDER_NUMBER ASC)
       OVER (PARTITION BY DEPT),'([^,]+)(,\1)+', '\1') AS USER_NAME
  FROM TEST_TABLE

-- 출처: https://too612.tistory.com/501
```
