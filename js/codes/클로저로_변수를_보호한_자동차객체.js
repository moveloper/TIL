var createCar=function(){
    var fuel=Math.ceil(Math.random()*10+10)
    var power=Math.ceil(Math.random()*3+2)
    var moved=0
    return{
        get moved(){
            return moved
        },
        run:function(){
            var km=Math.ceil(Math.random()*6)
            var wasteFuel=km/power
            if(fuel<wasteFuel){
                console.log("이용불가")
                return
            }
            fuel-=wasteFuel
            moved+=km
            console.log(km+'km 이동(총 '+moved+'km). 남은연료: '+fuel)
        }
    }
}
var car=createCar()

car.run() //3km 이동(총 3km). 남은연료: 11.4
console.log(car.moved)  // 3
console.log(car.fuel)  // undefined
console.log(car.power)  // undefined

car.fuel=1000
console.log(car.fuel)  // 1000
car.run() // 이동(총 9km). 남은연료: 10.200000000000001

car.power=100
console.log(car.power) // 100
car.run() // 1km 이동(총 10km). 남은연료: 10.000000000000002

console.log(car)  // { moved: [Getter], run: [Function: run], fuel: 1000, power: 100 }

// 클로저로 외부 컨텍스트를 기억하고 있기 때문에, car객체의 멤버 값을 변화시켜도 
// car객체가 처음 만들어졌을 때의 컨텍스트를 기억하고 출력하는 것으로 이해했다. 
