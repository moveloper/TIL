# 개발중 발생했던 문제들

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
