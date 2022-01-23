// call 메서드
var func = function(a,b,c){
    console.log(this,a,b,c)
}

func(1,2,3)
func.call({x:1},4,5,6)

var obj ={
    a:1,
    method:function(x,y){
        console.log(this.a,x,y)
    }
}

obj.method(2,3)
obj.method.call({a:4},5,6)
console.log("=============================================")

// 유사배열객체에 배열 메서드를 적용(1)
var obj ={
    0:'a',
    1:'b',
    2:'c',
    length:3
}
Array.prototype.push.call(obj,'d')
console.log(obj)

var arr = Array.prototype.slice.call(obj)
console.log(arr)
console.log("=============================================")

// arguments, NodeList에 배열 메서드 적용
// function a(){
//     var argv = Array.prototype.slice.call(arguments)
//     argv.forEach(function(arg){
//         console.log(arg)
//     })
// }
// a(1,2,3)

// document.body.innerHTML = '<div>a</div><div>b</div><div>c</div>'
// var nodeList = document.querySelectorAll('div')
// var nodeArr = Array.prototype.slice.call(nodeList)
// nodeArr.forEach(function(node){
//     console.log(node)
// })
console.log("=============================================")

// 문자열에 배열 메서드 적용 예시
var str = 'abc def'

//Array.prototype.push.call(str, ',pushed string') // 문자열은 length값이 readonly라 에러
Array.prototype.concat.call(str,'string') // [String {"abc, def"}, "string"]
Array.prototype.every.call(str,function(char){return char!==' '}) // false
Array.prototype.some.call(str,function(char){return char===' '}) // true

var newArr = Array.prototype.map.call(str,function(char){return char+'!'})
console.log(newArr)

var newStr = Array.prototype.reduce.apply(str,[
    function(string,char,i){return string+char+i}
])
console.log(newStr)
console.log("=============================================")

// ES6 Array.from 메서드
var obj={
    0:'a',
    1:'b',
    2:'c',
    length:3
}
var arr=Array.from(obj)
console.log(arr)
console.log("=============================================")

// 생성자 내부에서 다른 생성자를 호출

function Person(name,gender){
    this.name=name;
    this.gender=gender;
}
function Student(name,gender,school){
    Person.call(this,name,gender)
    this.school=school
}
function Employee(name,gender,company){
    Person.apply(this,[name,gender])
    this.company=company
}
var by=new Student('보영','female','단국대')
var jn=new Employee('재난','male','구글')
console.log("=============================================")

// 여러 인수를 받는 메서드
var number=[10,20,3,16,45]
var max=Math.max.apply(null,number)
var min=Math.min.apply(null,number)
console.log(max,min)
console.log("=============================================")

// ES6의 펼치기 연산자 활용
const numbers=[10,20,3,16,45]
const maxNum=Math.max(...numbers)
const minNum=Math.min(...numbers)
console.log(maxNum,minNum)
console.log("=============================================")

