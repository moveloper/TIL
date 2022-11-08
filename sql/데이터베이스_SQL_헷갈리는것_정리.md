# SQL 헷갈리는 것들 정리

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
## SELECT한 쿼리의 결과로우 수가 매번 다르게 나오는 상황 
- 원인: FROM 절의 인라인 뷰에서 ROW_NUMBER() OVER (PARTITION BY 컬럼명 ORDER BY 컬럼명)을 사용하고 ROWNUM = 1 조건으로 데이터를 가져왔는데, ORDER BY 절에 같은 값이 많아 순서가 일정하지 않은 결과를 가져오게 되었다. 결과값이 일정하지 않다보니 이 인라인뷰와 조인할 때마다 조인에 성공하는 로우수가 달랐던 것이다.
- 해결: ORDER BY 절에 명확하게 순서를 나눌 수 있는 컬럼을 추가해서 매번 같은 결과값을 보장할 수 있도록 수정하였다. 

## dbms_xplan.display_cursor 를 SQL DEVELOPER에서 사용할 때 발생했던 문제
원인은 잘 모르겠으나, SQL DEVELOPER에서 해당 패키지 사용시 `cannot fetch plan for SQL_ID` 에러가 발생하였다. 같 은 쿼리를 몇 번 날리면 가끔 성공적으로 결과를 불러올 때도 있는데 아닐 때도 있는 상황. 해결방안으로 `set serveroutput off` 하면 된다. 추측하건데, dbms_xplan.display_cursor 사용시 set serveroutput on 일 때 충돌나는 코드가 있는 것 같다. 
 
## 3개 이상 테이블을 OUTER JOIN 할 때 
```
WITH TAB1 AS(
SELECT '1' COL1, '1' CO2 FROM DUAL
UNION ALL
SELECT '2' COL1, '2' CO2 FROM DUAL
UNION ALL
SELECT '3' COL1, '3' CO2 FROM DUAL
)
,
TAB2 AS (
SELECT '1' COL1, '1' CO2 FROM DUAL
UNION ALL
SELECT '1' COL1, '1' CO2 FROM DUAL
UNION ALL
SELECT '1' COL1, '1' CO2 FROM DUAL
UNION ALL
SELECT '2' COL1, '2' CO2 FROM DUAL
UNION ALL
SELECT '2' COL1, '2' CO2 FROM DUAL
UNION ALL
SELECT '3' COL1, '3' CO2 FROM DUAL
)
,
TAB3 AS(
SELECT '3' COL1, '3' CO2 FROM DUAL
UNION ALL
SELECT '3' COL1, '3' CO2 FROM DUAL
)

1)
SELECT *
FROM TAB1 A
   , TAB2 B
   , TAB3 C
WHERE A.COL1 = B.COL1(+)
  AND A.COL1 = C.COL1(+)

1	1	1	1		
1	1	1	1		
1	1	1	1		
2	2	2	2		
2	2	2	2		
3	3	3	3	3	3
3	3	3	3	3	3

2)
SELECT *
FROM TAB1 A
   , TAB2 B
   , TAB3 C
WHERE A.COL1 = B.COL1(+)
  AND B.COL1 = C.COL1(+)

3	3	3	3	3	3
3	3	3	3	3	3
1	1	1	1		
1	1	1	1		
1	1	1	1		
2	2	2	2		
2	2	2	2		  

1번 쿼리는 TAB1을 TAB2와 조인한 결과테이블에서 TAB1 기준으로 다시 TAB3과 조인하여 결과를 가져온다.   
2번 쿼리는 TAB1을 TAB2와 조인한 결과테이블에서 TAB2 기준으로 다시 TAB3과 조인하여 결과를 가져온다.  
```
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
## OUTER JOIN 시 착각하기 쉬운 것
OUTER JOIN을 하게되면 뭔가 DRIVING TABLE의 ROW 수가 100건이면 100건의 결과만 나와야 될 것 같은 착각을 했다. LEFT OUTER JOIN을 기준으로 1:M의 관계인 경우, 결과 집합의 내용은 LEFT 기준이지만 결과집합의 건수는 RIGHT가 기준이다. 즉 내용은 DRIVING TALBE의 100건에 해당하는 내용이 모두 존재하고, 만약 DRIVEN TABLE에 여러 행이 조건에 일치한다면 100 + a 의 결과 건수가 되는 것이다. INNER JOIN 시에는 건수에 신경안쓰다가, OUTER JOIN 시에 왠지 건수가 기준 테이블 건수와 같아야 된다는 잘못된 생각을 했다.  

## MERGE INTO 
https://wakestand.tistory.com/121
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

## COUNT(*) 과 NULL 
```
COUNT(컬럼명)을 사용하면 NULL값은 제외하고 COUNT 한다.  
COUNT(*)을 사용하면 NULL도 포함하여 전부 COUNT 한다.
```
## CASE 함수와 ORDER BY로 특정 값 우선정렬하기 
```
SELECT *
FROM 주문테이블
ORDER BY (CASE WHEN 주문상태 = '배송완료' THEN 1 ELSE 9 END ), 주문일자 ASC;

주문상태 컬럼을 기준으로 배송완료이면 1순위로 거짓이면 2순위로 정렬한다. 그 이후에 주문일자순으로 오름차순으로 정렬한다. 
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

## CUBE 함수
```
SELECT A.ID, B.CODE, B.QUAN, SUM(B.QUAN)
FROM A INNER JOIN B
ON A.ID = B.ID
GROUP BY CUBE(A.ID, B.CODE, (B.CODE, B.QUAN))
ORDER BY A.ID, B.CODE, B.QUAN;

ID	CODE	QUAN        SUM(B.QUAN)
1	ELECTRO	100	100
1	ELECTRO	100	100
1	ELECTRO	 - 	100
1	WATER	200	200
1	WATER	200	200
1	WATER	 - 	200
1	WIND	300	300
1	WIND	300	300
1	WIND	 - 	300
1	 - 	 - 	600
2	ELECTRO	200	200
2	ELECTRO	200	200
2	ELECTRO	 - 	200
2	WATER	300	300
2	WATER	300	300
2	WATER	 - 	300
2	 - 	 - 	500
3	ELECTRO	300	300
3	ELECTRO	300	300
3	ELECTRO	 - 	300
3	 - 	 - 	300
 - 	ELECTRO	100	100
 - 	ELECTRO	100	100
 - 	ELECTRO	200	200
 - 	ELECTRO	200	200
 - 	ELECTRO	300	300
 - 	ELECTRO	300	300
 - 	ELECTRO	 - 	600
 - 	WATER	200	200
 - 	WATER	200	200
 - 	WATER	300	300
 - 	WATER	300	300
 - 	WATER	 - 	500
 - 	WIND	300	300
 - 	WIND	300	300
 - 	WIND	 - 	300
 - 	 - 	 - 	1400

```
이린식으로 쿼리가 있을 때 CUBE 함수는 모든 경우의 수를 출력하고(위에서는 2^3 = 8가지 케이스) 각각의 소계를 출력해준다고 생각하면 된다. 여기서 (B.CODE, B.QUAN)가 이해가 안되었는데, A.ID를 A, B.CODE를 B, B.QUAN을 C라고 했을 때 조합이 (A,B,(B,C)), (A,B), (B,(B,C)), ((B,C), A), (A), (B), ((B,C)), () 이다. 여기서 (A,B,(B,C)), (B,(B,C)), ((B,C), A), ((B, C))에 B가 중복되어 같은 데이터가 테이블로 출력되는 것처럼 보인다. 그러나 인간이 보기에는 같은 데이터일지는 몰라도 오라클은 B와 (B, C)를 독립적인 컬럼으로 인식하고 각각을 중복되지 않는 데이터로 인식하기 때문에 위와같이 중복되는 행들이 출력되는 것이다. 때문에 (A,<u>**B**</u>,(B,C)) 와 ((<u>**B**</u>,C), A) 총계는 중복된 것처럼 보여 두 번씩 나타나고 있고, 마찬가지로 (B,(B,C))와 ((B,C)) 총계 역시 두 번 나타나는 거슬 볼 수 있다. 같은 통계인 것처럼 보이지만 사실 각각 다른 통계를 나타내는 것이다


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
