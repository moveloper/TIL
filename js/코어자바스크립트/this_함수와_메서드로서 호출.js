// 함수로서 호출 
var func = function(x){
    console.log(this, x)
}
func(1) // this = window
console.log("=============================================")

// 메서드로서 호출 - 점 표기법, 대괄호 표기법
var obj = {
    method: func
}
obj.method(2) // this = obj
obj['method'](2);
console.log("=============================================")

// 내부 함수에서의 this 
var obj1 = {
    outer: function(){
        console.log(this)
        var innerFunc = function(){
            console.log(this)
        }
        innerFunc()
        
        var obj2 = {
            innerMethod: innerFunc
        }
        obj2.innerMethod()
    }
}
obj1.outer()
console.log("=============================================")

// 내부함수에서의 this를 우회하는 방법
var obj = {
    outer: function()   {
        console.log(this)
        var innerFunc1 = function(){
            console.log(this)
        }
        innerFunc1()

        var self = this;
        var innerFunc2 = function()
        {
            console.log(self);
        }
        innerFunc2()
    }
}
obj.outer()
console.log("=============================================")

// this를 바인딩하지 않는 함수(화살표 함수) => 실행 컨텍스트를 생성할 때 this 바인딩
// 과정 자체가 빠지게 되어, 상위 스코프의 this를 그대로 활용할 수 있다.

var obj = {
    outer: function(){
        console.log(this)
        var innerFunc = () =>{
            console.log(this);
        }
        innerFunc()
    }
}
obj.outer()