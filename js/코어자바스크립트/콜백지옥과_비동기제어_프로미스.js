var i=new Promise(function(resolve){
    setTimeout(function(){
        var name='에스프레소'
        console.log(name)
        resolve(name)
    },500)
}).then(function(prevName){
    return new Promise(function(resolve){
        setTimeout(function(){
            var name = prevName+', 아메리카노'
            console.log(name)
            resolve(name)
        },500)
    })
}).then(function(prevName){
    var name = prevName+', 카페모카'
        setTimeout(function(){
            console.log(name)
        },1500)
    return name
    //then 핸들러에서 값을 그대로 반환한 경우에는 Promise.resolve(<핸들러에서 반환한 값>)을 
    // 반환하는 것과 같다. 대신 비동기적인 then이 되기 때문에 promise를 쓴 의미가 퇴색된다    
}).then(function(prevName){
    var name = prevName+', 콜드브루'
        setTimeout(function(){
            console.log(name)
        },1500)
    return name 
    //then 핸들러에서 값을 그대로 반환한 경우에는 Promise.resolve(<핸들러에서 반환한 값>)을 
    // 반환하는 것과 같다. 대신 비동기적인 then이 되기 때문에 promise를 쓴 의미가 퇴색된다
}).then(function(prevName){
    var name = prevName+', 카페라떼'
        setTimeout(function(){
            console.log(name)
        },2500)
    return name
    //then 핸들러에서 값을 그대로 반환한 경우에는 Promise.resolve(<핸들러에서 반환한 값>)을 
    // 반환하는 것과 같다. 대신 비동기적인 then이 되기 때문에 promise를 쓴 의미가 퇴색된다
}) 
console.log(i)
// 아래 커피 3종류가 동시에 출력된다.

// var addCoffee=function(name){
//     return function(prevName){
//         return new Promise(function(resolve){
//             setTimeout(function(){
//                 var newName=prevName? (prevName+', '+name):name
//                 console.log(newName)
//                 resolve(newName)
//             },500)
//         })
//     }
// }
// addCoffee('에스프레소')()
//     .then(addCoffee('아메리카노'))
//     .then(addCoffee('카페모카'))
//     .then(addCoffee('카페라떼'))