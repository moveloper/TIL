console.log(sum(1,2))
console.log(multiply(3,4))

function sum(a,b){  // 함수 선언문 sum
    return a+b
}

var multiply = function(a,b){   // 함수 표현식 
    return a*b
}

// 변수 multiply는 호이스팅 되어 메모리 공간을 확보하고 있지만 
// 함수 표현식은 호이스팅 되지 않아 multiply에 할당되지 않는다
// 따라서 multiply is not a function 이라는 에러메시지가 호출된다. 