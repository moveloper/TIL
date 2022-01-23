 (function () {
    console.log("hello world")
  })();   // 실행됨
  // 호이스팅 차이
  hello(); // hello
  world(); // world is not defined
  
  function hello() {
    console.log("hello")
  }
  
  const world = function() {
    console.log("world")
  };