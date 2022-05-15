# JOIN 
![](../assets/sql/join.png)

## SQL의 JOIN에서 ON과 WHERE의 차이
두 sql문을 비교해봅시다. 
```sql
1)
SELECT *
FROM t1 LEFT JOIN t2
ON (t1.column1 = t2.column1)
WHERE t2.column2 = 10;
2)
SELECT *
FROM t1 LEFT JOIN t2
ON (t1.column1 = t2.column1 AND t2.column3 = 10);

        t1                      t2
column1 | column2       column1 | column3
    1   |   4              1    |   10
    2   |   5              2    |   11
    3   |   6
```

1)의 경우에는 t1과 t2 테이블의 OUTER JOIN을 수행한 뒤에 't2.column3 = 10'인 데이터를 추출하지만, 2)의 경우에는 t1 테이블과 t2 테이블 't2.column3 = 10'인 경우를 OUTER JOIN한 결과가 나옵니다.  
```  
1)                   
column1 | column2 | column1 | column3     
    1   |   4     |    1    |   10          

2)
column1 | column2 | column1 | column3     
    1   |   4     |    1    |   10   
    2   |   5     |  null   |  null
    3   |   6     |  null   |  null
```
이처럼 ON과 WHERE의 경우 JOIN을 하는 범위가 달라집니다. 최상단의 벤다이어그램에서 볼 수 있듯이 차집합을 구할 때 where절을 사용할 수 있습니다. 
```sql
SELECT *
FROM t1 LEFT JOIN t2
ON (t1.column1 = t2.column1)
WHERE t2.column2 IS NULL;

결과)
column1 | column2 | column1 | column3  
    3   |   6     |  null   |  null
```


## OUTER JOIN 및 상수 값
 - 조인 대상 테이블 중 데이터가 없는 테이블에 (+)를 붙인다 
 - <U>외부 조인의 조인 조건이 여러 개일 때 모든 조건에 (+)를 붙여야한다.</U> 그렇지 않으면 OUTER JOIN이 수행 후 실행되는 WHERE절에 조건과 같아진다. 
    ```
    1번)
    SELECT * 
    FROM A, B
    WHERE A.ID = B.ID (+)
    AND A.CHECK = 'Y'
    AND B.CHECK = 'Y'
    
    2번)
    SELECT * 
    FROM A, B
    WHERE A.ID = B.ID (+)
    AND A.CHECK = 'Y'
    AND B.CHECK(+) = 'Y'

    1번은 다음과 같은 의미이다
    SELECT *
    FROM A
    LEFT JOIN B 
         ON (A.ID = B.ID)
    WHERE A.CHECK = 'Y'
    AND B.CHECK = 'Y'

    2번은 다음과 같은 의미이다
    SELECT *
    FROM A
    LEFT JOIN B
         ON (A.ID = B.ID
            AND B.CHECK = 'Y')
    WHERE A.CHECK = 'Y'
    ```
 - (+)연산자가 붙은 조건과 OR, IN은 함께 사용할 수 없다.(IN절에 포함되는 값이 1개인 때는 사용가능하긴 함)

## JOIN 원리

출처: https://kshmc.tistory.com/entry/JOIN-원리

- DBMS 작동원리 : 평소에 데이터는 하드디스크의 데이터 파일에 저장해 두었다가 필요한 시점에 메모리로 복사한다.(오라클은 이때 사용하는 메모리를 데이터베이스 버퍼 캐시라고한다) 여기서 중요한 것은 칼럼 100개를 가진 테이블이 하드디스크에 저장되어 있을 때 사용자가 그 중 1개의 칼럼에 SELECT를 수행할 경우 해당 칼럼 1개만 메모리로 복사하는 것이 아니라 일단 100개의 칼럼 모두를 메모리로 복사해 온다는 점이다. 그래서 불필요한 I/O도 많고 메모리 사용량도 많이 생기기 때문에 정규화를 철저히 해서 부하를 최대한 줄여야한다. 일단 메모리로 올라온 테이블에서 필요한 칼럼을 가져와서 사용자가 원하는 결과를 만들어야 한다.





1) NESTED LOOP JOIN(가장 기본적인 JOIN 기법)
    ```
    SELECT E.ENAME, D.DNAME

    FROM EMP E, DEPT D

    WHERE E.DEPTNO = D.DEPTNO;
    ```




    SQL을 수행하면 오라클은 아래와 같은 순서로 작업을 수행한다.

    1. 사원 테이블과 부서 테이블을 메모리(데이터베이스 버퍼 캐시)로 복사해온다.

    2. 그후에 사원테이블에서 사원이름을 꺼내서 임시 작업공간으로 가져 간다.(인덱스 상황이나 다른 요소에 따라 작업순서가 변경될 수도 있다.)

    3. 그 후에 부서 테이블에서 해당부서명을 찾으러 가는데 그때 위 SQL의 3행에 있는 조건을 보고 해당 조건에 맞는 데이터를 찾아서 부서명을 가져온다.

    4. 한 행의 작업이 끝나면 다시 처음 테이블로 돌아가서 두 번째 행의 이름을 다시 PGA로 가져온다.

    5. 다시 부서 테이블에 가서 사원 테이블에서 가져온 두 번째 행의 부서번호와 동일한 부서번호를 가진 부서명을 꺼내온다.

    앞과 같은 과정을 계속 반복해서 먼저 읽었던 사원테이블의 데이터가 끝이 날 때까지 작업이 반복(LOOP)됩니다.

    그래서 이 JOIN을 NESTED LOOP JOIN이라고도 하며 모든 JOIN의 기본이 되는 JOIN이다.

    또한 JOIN을 수행하는 횟수는 먼저 읽는 테이블의 행 수 만큼 JOIN이 수행된다.

    그래서 먼저 읽는 테이블이 JOIN의 성늘을 결정한다고해서 DRIVING TABLE(선행 테이블)이라고 부르고 나중에 읽는 테이블을 DRIVEN TABLE(후행 테이블)이라고 부른다.

    여러 개의 테이블을 JOIN해야 할 경우 JOIN의 성능은 어떤 테이블을 선행 테이블로 설정하는가가 아주 중요하다.

    이것을 결정해 주는 오라클 내부 구성요소가 옵티마이저인데 RULE BASED OPTIMIZER(규칙 기반 옵티마이저)를 사용할 경우에는 쿼리를 수행하는 사람이 선행 테이블을 계산해서 결정해야 했다. 

    그래서 실력좋은 개발자나 DBA일 경우 JOIN 작업을 아주 빠르게 수행할 수 있지만 실력이나 경험이 부족한 사람이 작성한 JOIN은 성능이 아주 느린 경우가 많다.

    그러나 현재 옵티마이저의 주류를 이루는 COST BASED OPTIMIZER(비용 기반 옵티마이저)는 이런 부분이 자동화 되어서 인덱스만 잘 만들어져 있다면 아주 좋은 성능을 내도록 해주고 있다.

    (PGA : PROGRAM GLOBAL AREA의 약자로 단어가 가진 의미 그대로 공유되지 않고 혼자서만 사용하는 공간.

    PGA는 프로세스에 대한 데이터와 제어정보가 포함되 비 공유 메모리 영역으로 서버 프로세스가 시작될 때 생성되며 데이터 베이스에 접속하는 

    모든 사용자에게 할당된 각각의 프로세스가 독자적으로 사용하는 오라클 데이터베이스의 메모리 공간이다.

    즉, 한 프로세스 혹은 스레드의 개별적인 메모리 공간으로 다른 프로세스와 스레드는 접근 불가, 사용자마다 공유하지 않고 개별적으로 사용한다.)

    (SGA : SYSTEM GLOBAL AREA 오라클 프로세스들이 접근하는 하나의 큰 공유 메모리 세그먼트.)

    위와 같은 SQL을 수행하게 되면 오라클은 emp 테이블의 Smith를 가져오고 Smith의 DNAME을 찾으로 DEPT 테이블로 가게 된다.

    그런데 DEPT 테이블에 데이터가 많을 경우 어떤 DNAME을 가져와야 할지 모르기 때문에 SQL 문자의 WHERE 절에 있는 조건을 보고 그 조건에 맞는 DNAME을 가져오는 것이다.

    만약 SQL 문장에서 WHERE 절에 잘못된 조건을 줄 경우나 조건을 안 줄 경우에는 올바른 데이터를 가져오지 못한다.(모든 데이터를 다 가져오게 되며 이를 카티션 곱이라 한다.)

    만약 DEPT 테이블에 데이터가 1억건이 있다라고 가정하면 오라클은 Smith의 DNAME을 찾기 위해 1억건을 읽어 본 후 적당한 데이터를 가져와야한다.
    이렇게 되면 Join의 성능이 아주 느려지게 된다. 
    그래서 Join과 더불어 필수적으로 인덱스를 사용하게 된다.

    위 그림과 같이 인덱스가 없을 경우 EMP 테이블에서 ENAME이 Smith인 데이터를 한 건 꺼내고 DEPT 테이블 가서 DNAME을 꺼내야 하는데 
    WHERE 조건대로 SMITH의 DEPTNO와 동일한DEPTNO를 DEPT 테이블에서 검색하게 된다.
    그런데 인덱스가 없기 때문에 만약 DEPT 테이블에 데이터가 1억 건이 들어 있을 경우 오라클은 DEPT 테이블의 1억 건을 다 읽고 난 후 원하던 부서번호 
    50번의 DNAME인 BD를 가져가게 된다. 
    위 그림처럼 4번째에서 50번을 찾았다 하더라도 50번이 하나만 있다는 보장을 못하기 때문에 전부를 다 읽게 되는 것이다.
    그리고 다시 Allen으로 돌아가서 Smith에서 했던 작업을 반복하게 된다.
    만약 emp 테이블에 데이터가 10건 있고 dept 테이블에 데이터가 1억건있다면 dept 테이블은 총 10억 번 읽게 되는 결과가 생긴다는 뜻이며 절대로 성능이 나올 수 가 없는 구조가 된다.

    그래서 오라클은 인덱스가 없을 경우 빨리 해당 데이터를 찾아서 결과를 출력하기 위한 방법으로 SORT-MERGE JOIN과 HASH JOIN을 지원한다.

   1) SORT-MERGE JOIN
   - 인덱스가 없을 경우 빨리 해당 데이터를 찾아서 결과를 출력하기 위해 고안한 방법 중 하나이다.
   - SORT MERGE JOIN란 용어처럼 SORT한 후 그 결과를 MERGE 해서 데이터를 찾는 방식이다.
   - 이 JOIN의 단점은 SORT할 때 시간이 너무 오래 걸린다는 것이다. 그래서 RBO보다 발전된 버전인 CBO에서는 
   - 이렇게 인덱스가 없을 경우 이 방법을 쓰지 않고 HASH 함수 기반의 HASH JOIN을 사용한다.
   - (RBO란 : RULE-BASED OPTIMIZATION 약자로 미리 정해진 규칙에 의한 실행 계획[규칙기반])
   - (CBO란 : COST-BASED OPTIMIZATION 약자로 통계정보와 I/O와 CPU 비용을 계산하여 실행계획을 예측[비용기반 최적화])

   1) HASH JOIN(CBO에서만 가능)
   - HASH JOIN은 양쪽 테이블 모두 JOIN 칼럼에 인덱스가 없을 경우에 과거의 SORT-MERGE JOIN이 시간이 너무 오래 걸리는 단점을 보완해서 만들어지 JOIN 방법이다.
   - 두개의 테이블에 인덱스가 없는 상황에서 JOIN을 수행한다면 아래와 같은 순서로 진행된다.
   - 1. 두 테이블 중에서 범위가 좁을 테이블을 메모리 (PGA 내부의 HASH AREA라는 곳)로 가져온다.
   - 2. JOIN 조건 칼럼의 데이터를 HASH 함수에 넣어서 나온 HASH VALUE 값으로 HASH TABLE을 생성한다.
   - 3. 후행 테이블의 JOIN 조건을 HASH 함수에 넣어서 HASH VALUE를 생성하고 이 값을 선행 테이블의 HASH TABLE의 값과 비교하여 같은 값이 있으면
   - 해당 칼럼의 값을 매칭한다.

   1) SORT-MERGE JOIN과 HASH JOIN 
   - 둘 다 모든 테이블을 다 읽는다는 부분은 동일하다.
   - 다른 점 : SORT- MERGE JOIN은 정렬을 해서 작업을 수행한다. 
   -           HASH JOIN은 정렬을 하지 않는다.
   - 성능 : 테이블의 특징에 따라 다르겠지만 일반적으로는 HASH JOIN이 SORT-MERGE JOIN 보다 2배 DLTKD TJDSMDDL WHGEK.
   - 일반적으로 HASH JOIN은 CBO DB 중 인덱스가 없는 TABLE에 JOIN이 발생할 경우 선택하는 방법이지만 경우에 따라서는 (추출해야할 데이터가 많을 경우 등)
   - 인덱스가 있다  하더라도 HASH JOIN을 수행하는 경우도 종종 있다. 그만큼 대용량 데이터를 처리할 경우 HASH JOIN 성능이 좋다는 의미이다.


출처: https://kshmc.tistory.com/entry/JOIN-원리