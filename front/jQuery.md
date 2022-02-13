# jQuery

## attr
1. .attr()은 요소(element)의 속성(attribute)의 값을 가져오거나 속성을 추가   
```js
$( 'div' ).attr( 'class' );
div 요소의 class 속성의 값을 가져온다.
```

2. .attr( attributeName, value )   
```js
$( 'h1' ).attr( 'title', 'Hello' );
h1 요소에 title 속성을 추가하고 속성의 값은 Hello로 한다.
```

## val과 attr 차이 
val()은 기본 html 문법에서  XXX.value 이고 attr 은  엘리멘트로 접근하는 것


## find

* .find()는 어떤 요소의 하위 요소 중 특정 요소를 찾을 때 사용
```js
$( 'h1' ).find( 'span' )
h1 요소의 하위 요소 중 span 요소를 선택.
```


## jQuery로 체크박스(checkbox) 제어(control) 하기
출처:https://openlife.tistory.com/381
```
1. checkbox checked 여부 :

id인 경우 : $('input:checkbox[id="checkbox_id"]').is(":checked") == true

name인 경우 : $('input:checkbox[name="checkbox_name"]').is(":checked") ==  true

 

=>  $('input[id="checkbox_id"]') + 옵션 형태로 작성 해도 문제는 없다

Ex) $('input[name="checkbox_name"]').is(":checked")

 

2. checkbox 전체 갯수 : $('input:checkbox[name="checkbox_name"]').length

3. checkbox 선택된 갯수 : $('input:checkbox[name="checkbox_name"]:checked').length

* 2,3번은 name 인 경우에만 가능

 

4. checkbox 전체 순회 하며 처리(동일한 name으로 여래개인 경우 전체를 컨트롤 할 수 있다.)

 $('input:checkbox[name="checkbox_name"]').each(function() {

      this.checked = true; //checked 처리

      if(this.checked){//checked 처리된 항목의 값

            alert(this.value); 

      }

 });

 

5. checkbox 전체 순회 하며 값을 값을 비교하여 checked 처리

 $('input:checkbox[name="checkbox_name"]').each(function() {

     if(this.value == "비교값"){ //값 비교

            this.checked = true; //checked 처리

      }

 });

 

* 동일한 name 으로 1개 or 여러개 있을 경우에는 같은 name 으로 된 모든 checkbox 가 checked 처리된다.

 

6. checkbox value 값 가져오기 :  $('input:checkbox[id="checkbox_id"]').val(); //단일건

7. checkbox checked 처리 하기 : $('input:checkbox[id="checkbox_id"]').attr("checked", true); //단일건

8. checkbox checked 여부 간단 확인: $("#checkbox_id"]').is(":checked"); //단일건

=== Reference ===

* 만약 해당 id, name이 존재하지 않더라도 javascript 에러가 발생하지 않는다.

```