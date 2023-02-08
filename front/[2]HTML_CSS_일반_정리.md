## CSS) 상대적인 크기를 정하는 em 단위와 rem 단위의 차이
* em은 상위 요소 크기의 몇 배인지로 크기를 정함
* rem은 문서의 최상위 요소, 즉 html 요소의 크기의 몇 배인지로 크기를 정한다.

## block 형식 태그 vs inline 형식의 태그 
* block 형식: div, h1~h6, p, 목록, 테이블, form
* inline 형식: span, a, input, 글자형식
* inline 형식은 width 속성과 height 속성이 적용되지 않는다. 또한 margin 속성이 div 태그의 좌우로만 지정된다.
* inline-block 형식은 inline 형식과 유사하지만 width 속성과 height 속성을 적용할 수 있다. margin 역시 상하좌우 설정이 된다. 
* block 형식은 당연히 다 가능.

## 선택자
* `*`는 body뿐만 아니라 html 태그도 적용 대상에 포함된다.
* `li.select {color: red;}`는 li 태그중 class 속성값으로 select를 가지는 태그의 color 속성을 red로 한다
* `input[type=text] {backgroud: blue;}`와 같은 경우, CSS는 HTML 태그가 기본으로 무엇을 출력하는지 관심이 없다. 따라서 input의 기본값이 text라고 해도 CSS가 적용되지 않는다.
* `#header h1, h2`는 id 속성값이 header인 태그의 후손 위치에 있는 h1 태그, 그리고 그냥 h2 태그를 말한다. 반면 `#header h1, #header h2`는 id 속성값이 header인 태그의 후손 위치에 있는 h1과 h2 태그에 모두 적용한다.
* table 태그는 tbody 태그가 자동으로 생성되기 때문에 자손 선택자를 사용하면 원하는 결과를 얻지 못할 수 있기 때문에 사용을 자제하자.
* 선택자A + 선택자B는 A 바로 뒤에오는 B 하나를 선택하고, 선택자A ~ 선택자B는 A 뒤에 위치하는 모든 B를 선택한다.
* 속성 앞에 `data-`를 붙이면 사용자 지정 속성으로 인정해준다. 

## CSS 속성들
* `display: none;`은 태그가 화면에서 제거되지만 `visibility: hidden;`은 화면에서 보이지 않을 뿐 자리를 차지하고 있다.
* box-sizing 속성은 width 속성과 height 속성이 padding과 border 속성을 포함하는지에 따라 다르다. 
  * content-box
    * 박스 너비 = width 속성 + 2 * (margin 속성 + border 속성 + padding 속성)
    * 박스 높이 = height 속성 + 2 * (margin 속성 + border 속성 + padding 속성) 
  * border-box
    * 박스 너비 = width 속성 + 2 * margin 속성
    * 박스 높이 = height 속성 + 2 * margin 속성

## overflow가 뭔데 자동으로 float 잡아주나?
출처: https://simssons.tistory.com/26
```
*width, height 특징
width auto : 부모만큼
height auto: 컨텐츠만큼

1. height:auto;는 자신이 포함한 컨텐츠의 높이값을 자신의 높이값으로 하는것.
   그러나 안의 자식 left_box가 float이 되면 그 부모인 wrap은 컨텐츠를 잡지 않는 것이 되어서 한줄로 줆.

2. 이때 overflow:hidden;을 주면 해결이 된다. 왜?
   overflow:hidden;은 주어진 사이즈만큼만 보여줌. 자신에게 주어진 사이즈만 나타내고, 
   자신의 크기를 넘어서는 것(overflow)은 숨긴다(hidden)!

3. 따라서, wrap에 overflow: hidden을 주면, wrap은 주어진 사이즈만큼의 height을 가지고 
  이를 넘어가는 것을 숨긴다. 그렇다면 wrap에게 주어진 높이는?  wrap의 height:auto;니까 
  wrap이 포함하는 컨텐츠 높이가 자신의 높이가 됨. 즉, left_box의 높이가 자신의높이가 됨.
  그래서 float으로 뜬 컨텐츠도 깨지지 않고 원하는대로 보이게 하는 것임.
  ```