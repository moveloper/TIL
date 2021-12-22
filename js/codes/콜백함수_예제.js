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
        var mappedValue=callback.call(thisArg||window,this[i],i,this)   // this에는 map을 호출한 객체가, thisArg는 콜백함수에 매칭시켜줄 this를 넘겨받는다
        mappedArr[i]=mappedValue
    }
    return mappedArr
}