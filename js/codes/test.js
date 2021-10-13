var a = 0;
function foo() {
    var b = 0;
    return function () {
        console.log(++a, ++b);
    };
}

var f1 = foo();
var f2 = foo();

f1();
f1();
f2();
f2();
f1();
f1();
f2();