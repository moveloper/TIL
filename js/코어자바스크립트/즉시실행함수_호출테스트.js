var outer=(function(){
    var a=1;
    var inner=function(){
        return ++a
    }
    return inner
})();
// 반면 outer에는 즉시실행함수를 실행한 결과가 담기게 되므로 [Funciont: inner]를 반환한다. 
console.log(outer)
// 반환된 inner 함수를 한 번 더 실행시킨 값을 보여준다
console.log(outer())    
outer=null