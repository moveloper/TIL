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