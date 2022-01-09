var a = 1;
var outer = function(){
    var inner = function(){
        console.log(a);
        var a = 3;  // 변수 은닉화 
    }
    inner()
    console.log(a)
}
outer()
console.log(a)