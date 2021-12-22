// 콜백 지옥 예시
// 콜백 함수 = 함수의 매개변수로 전달되는 함수 
// 사용이유: 적절한 시기(특히 비동기적인 상황을 제어하기 위한)에 콜백 함수를 실행시키기 위해서 
var a= function(callback){
    console.log("시작")
    // 기다리지 않음
    setTimeout(function(name){
        var coffeeList=name
        // 기다리지 않고 맨 아래 console.log(coffeeList)로
        setTimeout(function(name){
            coffeeList+=', '+name
            console.log(coffeeList)
            // 기다리지 않음
            setTimeout(function(name){
                coffeeList+=', '+name
                console.log(coffeeList)
                // 기다리지 않음
                setTimeout(function(name){
                    coffeeList+=', '+name
                    console.log(coffeeList)
                    callback()
                },500,'카페라떼')
            },500,'카페모카')
        },500,'아메리카노')
        console.log(coffeeList)
    },1500,'에스프레소')
    console.log("끝")
}
// 
var b=function(){
    console.log("b 시작")
    console.log("b 끝")
}
a(b)
//=====================================================
// $.get()은 비동기 
// parseRes, saveAuth, display는 동기함수이고 비동기로 처리되면
// 안되기 때문에 콜백함수 형태로 불러오고 이는 콜백 지옥을 만들게 된다.
$.get('url', function(response) {
    parseRes(response, function(id) {
        saveAuth(id, function(result) {
            display(result, function(text) {
                console.log(text);
            });
        });
    });
});
// 개선 
function parseResCallback(id) {
    saveAuth(id, saveAuthCallback);
}
function saveAuthCallback(res) {
    display(res, displayCallback);
}
function displayCallback(text) {
    console.log(text);
}
$.get('url', function(response) {
    parseRes(response, parseResCallback);   // parseRescallback = 콜백함수 
                            // parseRes 함수 내에서 id값을 넣어서 parseResCallback(id)를 호출했을 것이다
});
//=====================================================
// 콜백 지옥 해결 - 기명 함수로 변환
var coffeeList=''
var addEspresso=function(name){
    coffeeList=name
    console.log(coffeeList)
    setTimeout(addAmericano,500,'아메리카노')
}
var addAmericano=function(name){
    coffeeList+=', '+name
    console.log(coffeeList)
    setTimeout(addMocha,500,'카페모카')
}
var addMocha=function(name){
    coffeeList+=', '+name
    console.log(coffeeList)
    setTimeout(addLatte,500,'카페라떼')
}
var addLatte=function(name){
    coffeeList+=', '+name   
    console.log(coffeeList)
}
setTimeout(addEspresso,500,'에스프레소')

// 비동기 작업의 동기적 표현 - Promise
new Promise(function(resolve){
    setTimeout(function(){
        var name='에스프레소'
        console.log(name)
        resol
    })
})

