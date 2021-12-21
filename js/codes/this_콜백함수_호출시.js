setTimeout(function(){
    console.log(this)
}, 300);    // this는 Window

[1,2,3,4,5].forEach(function(x){
    console.log(this, x)
}); // this는 Window

document.body.innerHTML += '<button id="a">클릭</button>'
document.body.querySelector('#a').addEvent  Listener('click', function(e){
    console.log("+++++++", this, "++++++++", e)
}); // querySelector('#a')가 this