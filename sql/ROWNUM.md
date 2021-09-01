# 오라클의 ROWNUM

ROWID는 각 행의 주소 값을 나타내는 행이다. ROWNUM은 데이터베이스에 저장되지 않고 의사 컬럼으로 참조만 되는데, SELECT절에 추출되는 데이터에 붙는 순번이라고 생각하면 된다. 
* 이 ROWNUM이 결정되는 시기는 WHERE절을 만족시킨 자료에 1부터 순번이 붙는다. 
* SELECT 문장의 실행 순서를 생각하면 ROWNUM은 ORDER BY전에 부여되고, ORDER BY는 마지막에 실행된다.

이러한 두 가지 특성으로 인해 몇 가지 주의할 점이 생긴다.
* ROWNUM 은 <, <= 와는 사용되지만, >, >=인 경우에는 동작하지 않는다
* 위와 같은 말인데 WHERE ROWNUM = 1 은 사용가능하나 WHERE ROWNUM = 2는 사용 불가능하다. 
* ORDER BY로 인해 ROWNUM의 순서가 뒤죽박죽이 된다. 

WHERE절을 만족시킨 자료에 ROWNUM이 붙기 때문에, 처음 레코드는 항상 ROWNUM이 1이다. 그런데 만약 WHERE ROWNUM = 2가 조건에 있다면 처음 생성되는 ROWNUM은 항상 1이기에 맞지 않는 조건이 된다. 즉 'ROWNUM이 2인가? -> 1이다 -> 옳지 않으므로 폐기 -> 새로운 레코드 읽기 -> ROWNUM이 2인가? -> 1이다 -> ....' 의 반복으로 데이터는 출력되지 않는다. 아래처럼 서브쿼리를 사용하면 ROWNUM = 2를 사용할 수 있긴 하다.

```sql
select * from
        (select rownum as rownumber, b.* from 테이블 b
) a
where a.rownumber=2;
```

다음은 ORACLE에서 순위가 높은 N개의 로우를 추출하고 싶을 때 ORDER BY와 WHERE절을 잘못 사용하는 경우이다.

```sql
SELECT ENAME, SAL
FROM EMP
WHERE ROWNUM <4
ORDER BY SAL DESC;
```
```
ENAME    SAL
------- ----
ALLEN   1600
WARD    1250
SMITH    800
```
위는 급여 순서에 상관없이 무작위로 추출된 3명을 내림차순으로 출력 한 것과 결과가 같다. 왜냐하면 데이터의 일부가 추출된 후에 정렬 작업이 진행되기 때문이다. 올바른 결과를 얻으려면 다음과 같은 방법을 사용해야 한다. 
```sql
SELECT ENAME, SAL
FROM (
    SELECT ENAME, SAL
    FROM EMP
    ORDER BY SAL DESC
) WHERE ROWNUM < 4;
```
```
ENAME   SAL
------ ----
KING   5000
SCOTT  3000
FORD   3000
```

