# 개발중_발생했던_문제들_SPRING

## VO 변수명 관련 오류
1. 변수명이 EMP_NO와 같이 대문자로 만들었을 때, 생성자 생성시 파라미터로 `this.EMP_NNO = eMP_NO`와 같이 매핑되어 MyBatis와 매핑이 되지 않았던 오류가 생김 
2. 변수명을 t_no와 같이 (한글자_변수명)으로 만들었을 때, jsp에서 el표현식에서 문제가 생겼었다.   
=> 변수의 첫번째 단어가 하나의 문자이거나 대문자일 때 자바의 네이밍 규칙을 따르지 않아 정상적으로 set, get이 되지 않은 것으로 보인다. 우선 네이밍 규칙을 따르는 방법으로 해결

## VO없이 map으로 @RequestBody로 값 받아올 때
VO가 있다면 최신 버전 스프링에서는 자동으로 JSON으로 받아온 값과 매핑 시켜주지만, Map으로 받아온 값은 @RequestBody없이 받아올 수 없다.
> RequestBody와 ResponseBody의 차이:https://admm.tistory.com/100   

```
JSP에서 넘겨준 JSON
{"codeNm":"하늘색","code":"BLUE","codeDiv":"COLOR"}

JAVA에서 사용
String code = (String)param.get("code");
```
 