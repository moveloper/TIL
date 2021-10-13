var a = (function() {
    console.log('hello')
  })()
  console.log(a)
  //console.log(a());
  
  /* 출력결과
  hello
  undefined
  
  마지막 주석문은 변수 a에는 익명함수가 아닌 익명함수의 반환값인
  undefined 이므로 error 이다.
  */