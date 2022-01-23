var partial=function(){
    var originalPartialArgs=arguments
    var func=originalPartialArgs[0]
    if(typeof func!=='function'){
        throw new Error('첫 번째 인자가 함수가 아닙니다')
    }
    return function(){
        var partialArgs=Array.prototype.slice.call(originalPartialArgs,1) // 클로저인 부분, originalPartialArgs가 이전에 받은 1,2,3,4,5를 기억하고 있다
        var restArgs=Array.prototype.slice.call(arguments)
        return func.apply(this.partialArgs.concat(restArgs))
    }
}

var add=function(){
    var result=0
    for(var i=0;i<arguments.length;i++){
        result+=arguments[i]
    }
    return result
}
var addPartial=partial(add,1,2,3,4,5)
console.log(addPartial(6,7,8,9,10))
console.log("END")