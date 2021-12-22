// setInverval 함수
var count=0;
var timer=setInterval(function(){
    console.log(count)
    if(++count>4) clearInterval(timer)
},300)

// var count=0;
// var cbFunc=function(){
//     console.log(count)
//     if(++count>4) clearInterval(timer)
// }
// var timer=setInterval(cbFunc,300)
console.log("=================================")
var obj=[10,20,30]
var newArr=obj.map(function(currentValue,index){
    console.log(currentValue,index)
    console.log(this)
    return currentValue+5
})
console.log(newArr)

// Array.prototype.map - 구현
Array.prototype.map=function(callback,thisArg){
    var mappedArr=[]
    for(var i=0;i<this.length;i++){
        var mappedValue=callback.call(thisArg||window,this[i],i,this)   // this에
        mappedArr[i]=mappedValue
    }
    return mappedArr
}

// 어떤 함수의 인자에 객체의 메서드를 전달하더라도 이는 결국 메서드가 아닌 함수일 뿐이다
var obj={
    vals:[1,2,3],
    logValues:function(v,i){
        console.log(this,v,i)
    }
}
obj.logValues(1,2);  // {vals:[1,2,3],logValues:f} 1 2
[4,5,6].forEach(obj.logValues)  // Window{...} 4 0 // Window{...} 5 1 // Window{...} 6 2

// 콜백 함수 내부의 this에 다른 값을 바인딩하는 방법: 전통적인 방식
var obj1={
    name:'obj1',
    func:function(){
        var self=this;
        return function(){
            console.log(self.name)
        }
    }
}

var obj2={
    name:'obj2',
    func:obj1.func
}
var callback2=obj2.func()
setTimeout(callback2,1500)
var obj3={name:'obj3'}
var callback3=obj1.func.call(obj3)
setTimeout(callback3,2000)
var callback=obj1.func()
setTimeout(callback,1000)
// 콜백 함수 내부에서 this를 사용하지 않은 경우
var obj1={
    name:'obj1',
    func:function(){
        console.log(obj1.name)
    }
}
setTimeout(obj1.func,1000)

// 전통적인 방식과 콜백 함수 내부에서 this를 사용하지 않은 경우를 보완하는 bind
var obj1={
    name:'obj1',
    func:function(){
        console.log(this.name)
    }
}
setTimeout(obj1.func.bind(obj1),1000)
var obj2={name:'obj2'}
setTimeout(obj1.func.bind(obj2),1500)