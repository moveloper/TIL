// bind 메서드 - this 지정과 부분 적용 함수 
var func=function(a,b,c,d){
    console.log(this,a,b,c,d)
}
func(1,2,3,4)   // Window{...} 1 2 3 4

var bindFunc1=func.bind({x:1})
bindFunc1(5,6,7,8)

var bindFunc2=func.bind({x:1},4,5)
bindFunc2(6,7)  //{x:1} 4 5 6 7
bindFunc2(8,9)  //{x:1} 4 5 8 9
console.log("=============================================")

// 내부함수에 this 전달 : call vs.bind
var obj = {
    outer:function(){
        console.log(this)
        var innerFunc=function(){
            console.log(this)
        }
        innerFunc.call(this)
    }
}
obj.outer()

var obj = {
    outer:function(){
        console.log(this)
        var innerFunc=function(){
            console.log(this)
        }.bind(this)
        innerFunc()
    }
}
obj.outer()
console.log("+++++++++++++++++++++++++++++++++++++")
// bind 메서드 - 내부함수에 this 전달
var obj={
    logThis:function(){
        console.log("=============================================")
        console.log(this)
        console.log("=============================================")
    },
    logThisLater1:function(){
        setTimeout(this.logThis,500)    // Window{...}
    },
    logThisLater2:function(){
        setTimeout(this.logThis.bind(this),1000)    // obj {...}
    }
}
obj.logThisLater1()
obj.logThisLater2()
console.log("=============================================")

// 화살표 함수 내부에서의 this
var obj={
    outer:function(){
        console.log(this)
        var innerFunc=()=>{
            console.log(this)
        }
        innerFunc()
    }
}
obj.outer()