# SQLD 공부하면서 틀렸던 개념들

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
이린식으로 쿼리가 있을 때 CUBE 함수는 모든 경우의 수를 출력하고(위에서는 2^3 = 8가지 케이스) 각각의 소계를 출력해준다고 생각하면 된다. 여기서 (B.CODE, B.QUAN)가 이해가 안되었는데, A.ID를 A, B.CODE를 B, B.QUAN을 C라고 했을 때 조합이 (A,B,(B,C)), (A,B), (B,(B,C)), ((B,C), A), (A), (B), (C), () 이다. 여기서 (A,B,(B,C)), (B,(B,C)), ((B,C), A)에서 B가 중복되어 같은 데이터가 테이블로 출력되는 것처럼 보인다. 그러나 우리가 보기에는 같은 데이터일지는 몰라도 오라클은 B와 (B, C)를 독립적인 컬럼으로 인식하고 각각을 중복되지 않는 데이터로 인식하기 때문에 위와같이 중복되는 행들이 출력되는 것이다. 즉 (A,<u>**B**</u>,(B,C)) 와 (A,B,(<u>**B**</u>,C))를 다른 데이터라고 보는 것이다.     