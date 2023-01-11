# 윈도우 함수란
- 분석함수 중에서 윈도우절(WINDOWNING 절)을 사용하는 함수를 윈도우 함수라고 한다.
- 윈도우절을 사용하면 PARTITION BY 절에 명시된 그룹을 좀 더 세부적으로 그룹핑 할 수 있다.
- 윈도우절은 분석함수중에서 일부(AVG, COUNT, SUM, MAX, MIN)만 사용 할 수 있다.
WINDOWNING 절 Syntax
```sql
윈도우 함수 OVER (
        PARTITION BY 절
            ORDER BY 절 [ASC|DESC]
        ROWS | RANGE
        BETWEEN UNBOUNDED PRECEDING | n PRECEDING | CURRENT ROW
            AND UNBOUNDED FOLLOWING | n FOLLOWING | CURRENT ROW
```
- ROWS : 물리적인 ROW 단위로 행 집합을 지정한다.
- RANGE : 논리적인 상대번지로 행 집합을 지정한다.
- BETWEEN ~ AND 절 : 윈도우의 시작과 끝 위치를 지정한다.
- UNBOUNDED PRECEDING : PARTITION의 첫 번째 로우에서 윈도우가 시작한다.
- UNBOUNDED FOLLOWING : PARTITION의 마지막 로우에서 윈도우가 시작한다.
- CURRENT ROW : 윈도우의 시작이나 끝 위치가 현재 로우 이다.

## WINDOWING 절 예제
### ROWS 사용 예제1
아래는 부서별(PARTITION BY deptno)로 이전 ROW(ROWS 1 PRECEDING)의 급여와 현재 ROW의 급여 합계를 출력하는 예제이다

```sql
SELECT empno, ename, deptno, sal, 
       SUM(sal) OVER (PARTITION BY deptno 
                          ORDER BY empno 
                           ROWS 1 PRECEDING ) pre_sum
  FROM emp;
 
 
-- PRE_SUM : 이전 ROW와 현재 ROW의 급여 합계가 출력된 것을 확인 할 수 있다. 
 EMPNO ENAME       DEPTNO        SAL    PRE_SUM
------ ------- ---------- ---------- ----------
  7782 CLARK           10       2450       2450
  7839 KING            10       5000       7450
  7934 MILLER          10       1300       6300
  7369 SMITH           20        800        800
  7566 JONES           20       2975       3775
  7788 SCOTT           20       3000       5975
  7876 ADAMS           20       1100       4100
  7902 FORD            20       3000       4100
  7499 ALLEN           30       1600       1600
  7521 WARD            30       1250       2850
  7654 MARTIN          30       1250       2500
  7698 BLAKE           30       2850       4100
  7844 TURNER          30       1500       4350
  7900 JAMES           30        950       2450
```

### ROWS 사용 예제2
아래 예제는 첫 번째 ROW부터 마지막 ROW까지의 합과(SAL1), 첫 번째 ROW부터 현재 ROW까지의 합(SAL2) 그리고 현재 ROW부터 마지막 ROW까지의 합(SAL3)을 출력하는 예제이다.
```sql
SELECT empno, ename, deptno, sal,
       SUM(sal) OVER(ORDER BY deptno, empno 
                ROWS BETWEEN UNBOUNDED PRECEDING 
                         AND UNBOUNDED FOLLOWING) sal1,
       SUM(sal) OVER(ORDER BY deptno, empno 
                ROWS BETWEEN UNBOUNDED PRECEDING 
                         AND CURRENT ROW) sal2,
       SUM(sal) OVER(ORDER BY deptno, empno 
                ROWS BETWEEN CURRENT ROW 
                         AND UNBOUNDED FOLLOWING) sal3
  FROM emp;
 
 
-- SAL1 : 첫 번째 ROW부터 마지막 ROW까지의 급여 합계이다. 
-- SAL2 : 첫 번째 ROW 부터 현재 ROW까지의 급여 합계이다. 
-- SAL3 : 현재 ROW부터 마지막 ROW까지 급여 합계이다.
 EMPNO ENAME       DEPTNO        SAL       SAL1       SAL2       SAL3
------ ------- ---------- ---------- ---------- ---------- ----------
  7782 CLARK           10       2450      29025       2450      29025
  7839 KING            10       5000      29025       7450      26575
  7934 MILLER          10       1300      29025       8750      21575
  7369 SMITH           20        800      29025       9550      20275
  7566 JONES           20       2975      29025      12525      19475
  7788 SCOTT           20       3000      29025      15525      16500
  7876 ADAMS           20       1100      29025      16625      13500
  7902 FORD            20       3000      29025      19625      12400
  7499 ALLEN           30       1600      29025      21225       9400
  7521 WARD            30       1250      29025      22475       7800
  7654 MARTIN          30       1250      29025      23725       6550
  7698 BLAKE           30       2850      29025      26575       5300
  7844 TURNER          30       1500      29025      28075       2450
  7900 JAMES           30        950      29025      29025        950
```
### RANGE 사용 예제
아래는 월별 금액 리스트를 출력하고, 직전 3개월 합계(AMT_PRE3)와 이후 3개월 합계(AMT_FOL3)를 함께 표시하는 예제이다.

아래 예제에서는 7월 데이터가 없기 때문에 직전 3개월 합계(AMT_PRE3) 8월의 경우 6월,5월 두 달치만 누적된 것을 확인 할 수 있다.
```sql

WITH test AS
(
SELECT '200801' yyyymm, 100 amt FROM dual
UNION ALL SELECT '200802', 200 FROM dual
UNION ALL SELECT '200803', 300 FROM dual
UNION ALL SELECT '200804', 400 FROM dual
UNION ALL SELECT '200805', 500 FROM dual
UNION ALL SELECT '200806', 600 FROM dual
UNION ALL SELECT '200808', 800 FROM dual
UNION ALL SELECT '200809', 900 FROM dual
UNION ALL SELECT '200810', 100 FROM dual
UNION ALL SELECT '200811', 200 FROM dual
UNION ALL SELECT '200812', 300 FROM dual
)
SELECT yyyymm
     , amt
     , SUM(amt) OVER(ORDER BY TO_DATE(yyyymm,'yyyymm')
                RANGE BETWEEN INTERVAL '3' MONTH PRECEDING
                          AND INTERVAL '1' MONTH PRECEDING) amt_pre3
     , SUM(amt) OVER(ORDER BY TO_DATE(yyyymm,'yyyymm')
                RANGE BETWEEN INTERVAL '1' MONTH FOLLOWING
                          AND INTERVAL '3' MONTH FOLLOWING) amt_fol3
  FROM test
;
 
-- AMT_PRE3 : 직전 3개월 합계
-- AMT_FOL3 : 이후 3개월 합계 
YYYYMM           AMT   AMT_PRE3   AMT_FOL3
--------- ---------- ---------- ----------
200801           100                   900
200802           200        100       1200
200803           300        300       1500
200804           400        600       1100
200805           500        900       1400
200806           600       1200       1700
200808           800       1100       1200
200809           900       1400        600
200810           100       1700        500
200811           200       1800        300
200812           300       1200 
```

> 출처: http://www.gurubee.net/lecture/2674

> 더 많은 예시: https://tiboy.tistory.com/570