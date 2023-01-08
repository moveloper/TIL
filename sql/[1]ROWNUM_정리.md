# 오라클의 ROWNUM

ROWID는 각 행의 주소 값을 나타내는 행이다. ROWNUM은 데이터베이스에 저장되지 않고 의사 컬럼으로 참조만 되는데, SELECT절에 추출되는 데이터에 붙는 순번이라고 생각하면 된다. 
* 이 ROWNUM이 결정되는 시기는 WHERE절을 만족시킨 자료에 1부터 순번이 붙는다. 
* SELECT 문장의 실행 순서를 생각하면 ROWNUM은 ORDER BY전에 부여되고, ORDER BY는 마지막에 실행된다.

이러한 두 가지 특성으로 인해 몇 가지 주의할 점이 생긴다.
* ROWNUM 은 <, <= 와는 사용되지만, >, >=인 경우에는 동작하지 않는다
* 위와 같은 말인데 WHERE ROWNUM = 1 은 사용가능하나 WHERE ROWNUM = 2는 사용 불가능하다. 
* ORDER BY로 인해 ROWNUM의 순서가 뒤죽박죽이 된다. 

WHERE절을 만족시킨 자료에 ROWNUM이 붙기 때문에, 처음 레코드는 항상 ROWNUM이 1이다. 그런데 만약 WHERE ROWNUM = 2가 조건에 있다면 처음 생성되는 ROWNUM은 항상 1이기에 맞지 않는 조건이 된다. 즉 'ROWNUM이 2인가? -> 1이다 -> 옳지 않으므로 폐기 -> 새로운 레코드 읽기 -> ROWNUM이 2인가? -> 1이다 -> ....' 의 반복으로 데이터는 출력되지 않는다. 아래처럼 서브쿼리를 사용하면 ROWNUM = 2를 사용할 수 있다.

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

## ROWNUM 순서
> 자세한 내용: https://5dol.tistory.com/127
```
또 ROWNUM 값이 실제로 할당되는 방법에 대해서도 많은 사람들이 오해를 하고 있습니다. ROWNUM 값은 쿼리의 조건절이 처리되고 난 이후, 그리고 sort, aggregation이 수행되기 이전에 할당됩니다. 또 ROWNUM 값은 할당된 이후에만 증가(increment) 됩니다. 따라서 아래 쿼리는 로우를 반환하지 않습니다.

select * 
  from t 
 where ROWNUM > 1;
첫 번째 로우에 대해 ROWNUM > 1의 조건이 True가 아니기 때문에, ROWNUM은 2로 증가하지 않습니다. 아래와 같은 쿼리를 생각해 봅시다.

select ..., ROWNUM
  from t
 where <where clause>
 group by <columns>
having <having clause>
 order by <columns>;
이 쿼리는 다음과 같은 순서로 처리됩니다.

1. FROM/WHERE 절이 먼저 처리됩니다.
2. ROWNUM이 할당되고 FROM/WHERE 절에서 전달되는 각각의 출력 로우에 대해 증가(increment) 됩니다.
3. SELECT가 적용됩니다.
4. GROUP BY 조건이 적용됩니다.
5. HAVING이 적용됩니다.
6. ORDER BY 조건이 적용됩니다.

따라서 아래와 같은 쿼리는 에러가 발생할 수 밖에 없습니다.

select * 
  from emp 
 where ROWNUM <= 5 
 order by sal desc;
이 쿼리는 가장 높은 연봉을 받는 다섯 명의 직원을 조회하기 위한 Top-N 쿼리로 작성되었습니다. 하지만 실제로 쿼리는 5 개의 레코드를 랜덤하게(조회되는 순서대로) 반환하고 salary를 기준으로 정렬합니다. 이 쿼리를 위해서 사용되는 가상코드(pseudocode)가 아래와 같습니다.

ROWNUM = 1
for x in 
( select * from emp )
loop
    exit when NOT(ROWNUM <= 5)
    OUTPUT record to temp
    ROWNUM = ROWNUM+1
end loop
SORT TEMP
위에서 볼 수 있듯 처음의 5 개 레코드를 가져 온후 바로 sorting이 수행됩니다. 쿼리에서 "WHERE ROWNUM = 5" 또는 "WHERE ROWNUM > 5"와 같은 조건은 의미가 없습니다. 이는 ROWNUM 값이 조건자(predicate) 실행 과정에서 로우에 할당되며, 로우가 WHERE 조건에 의해 처리된 이후에만 increment 되기 때문입니다.

올바르게 작성된 쿼리가 아래와 같습니다.

select *
  from  
( select * 
    from emp 
   order by sal desc ) 
 where ROWNUM <= 5;
```

## DISTINCT와 ROWNUM
SELECT 다음에 DISTINCT가 이뤄지기 때문에 WHERE ROWNUM <= 1000이라는 조건을 주고 SELECT 된 값중에 중복값이 존재한다면, 1000개 이하의 데이터가 출력된다. 