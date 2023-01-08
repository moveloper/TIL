# IN과 EXISTS 정리

## EXISTS

 * 'EXISTS 절의 결과가 존재하는가?'로 T/F를 반환한다.
 * 메인 쿼리에 먼저 접근하여 하나의 레코드를 가져온다. 그리고 그 레코드에 대해서 EXISTS 절 이하의 서브쿼리를 수행한다.
 * EXISTS는 서브 쿼리에 일치하는 결과가 하나라도 있으면 쿼리를 더 이상 수행하지 않는다. 
 * EXISTS는 메인 쿼리의 레코드들을 모두 순회하게 되지만 서브 쿼리는 경우에 따라 다르다.
 * 따라서 서브 쿼리 테이블에 데이터량이 많으면 EXISTS를 사용하는 것이 성능에 좋다.    

## NOT EXISTS
 * EXISTS와 반대로 서브 쿼리에 값이 존재하지 않을 때 해당 레코드를 출력한다. 
 * NULL에 대한 비교연산은 항상 UNKNOWN 값을 반환하므로 쿼리에 대한 결과가 존재하지 않게 되고, 레코드를 출력하게 된다.

## IN
 * 메인 쿼리 레코드에 서브 쿼리의 결과와 동일한 값이 있는지를 확인하고 T/F를 반환한다. 
 * 메인 쿼리의 컬럼값들을 가져와 리스트로 IN에 전달하고, 이후에 서브 쿼리에서 하나씩 비교한다.
 * 따라서 서브 쿼리 테이블을 모두 순회하게 된다. 이는 성능에 영향을 준다.

## NOT IN
 * IN과 반대로 메인 쿼리의 레코드 값과 서브 쿼리의 모든 값들을 비교해 일치하지 않을 때 해당 레코드를 반환한다. 
 * NULL에 대한 비교연산은 항상 UNKNOWN 값을 반환한다. NOT IN 절은 그 안에 존재하는 레코드들과 '일치하는 값이 없는가?'로 T/F가 판가름난다. 그런데 NULL과 비교를 하게되면 UNKNOWN 아니면 FALSE가 되므로 '일치하는 값이 없는가?'에 대한 TRUE 결과를 내놓지 못한다. 따라서 NOT IN 절 안에 NULL이 존재하면 아무런 결과가 출력되지 않는다. 

### 참고) UNKNWON과 비교 연산자
#### <AND 연산>
Expression 1 |	Expression 2 |	결과
---|---|---
TRUE|	UNKNOWN|	UNKNOWN
UNKNOWN|	UNKNOWN|	UNKNOWN
FALSE|	UNKNOWN|	FALSE
#### <OR 연산>
Expression 1|	Expression 2|	결과|
---|---|---
TRUE|	UNKNOWN|	TRUE
UNKNOWN|	UNKNOWN|	UNKNOWN
FALSE|	UNKNOWN|	UNKNOWN

## IN과 EXISTS 차이점 정리
1. 성능: EXISTS는 조건에 해당하는 레코드를 발견하면 더 이상 수행하지 않으므로 IN에 비해 수행시간이 짧아 성능이 좋다. 
2. 동작순서: EXISTS는 메인 쿼리의 결과값을 서브 쿼리에 대입하여 비교 후 결과를 출력한다. 반대로 IN은 서브 쿼리의 결과값을 메인 쿼리에 대입하여 비교 후 결과를 출력한다.
3. NULL 처리: NOT EXISTS에서는 NULL과 비교했을 때 결과가 없으므로 레코드를 출력하는 반면, NOT IN에서는 NULL과 비교하여 '일치하는 값이 존재하지 않는가?'에 대한 ture 결과를 얻을 수 없기 때문에 레코드를 출력할 수 없다. 이러한 문제로 발생하는 데이터 손실을 막기 위해 NULL 컬럼에 대한 전처리과정이 필요하다. 

## Reference
 * https://doorbw.tistory.com/222