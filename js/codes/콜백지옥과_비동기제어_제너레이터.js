// '*'이 붙은 함수는 Generator이고 이를 실행하면 Iterator가 반환되는데
// Iterator는 next라는 매서드를 가지고 있다. 이 next 메서드를 호출하면 
// Generator 함수 내부에서 가장 먼저 등장하는 yield에서 함수의 실행을 멈춘다.
// 이후 다시 next 메서드를 호출하면 앞서 멈췄던 부분부터 시작해서 그 다음에 등장하는
// yield에서 함수의 실행을 멈춘다. 비동기 작업이 완료되는 시점마다 next 메서드를 호출해준다면
// Generator 함수 내부의 소스가 위에서 아래로 순차적으로 진행된다.
var addCoffee=function(prevName,name){
    setTimeout(function(){
        coffeeMaker.next(prevName?prevName+', '+name:name)
    },500)
}
var coffeeGenerator=function*(){
    var espresso=yield addCoffee('','에스프레소')
    console.log(espresso)
    var americano=yield addCoffee(espresso,'아메리카노')
    console.log(americano)
    var mocha=yield addCoffee(americano,'카페모카')
    console.log(mocha)
    var latte=yield addCoffee(mocha,'카페라떼')
    console.log(latte)
}
var coffeeMaker=coffeeGenerator()
coffeeMaker.next()