// 콜백함수 내에서 thisArg를 인자로 받는 메서드의 this 바인딩
var report={
    sum:0,
    count:0,
    add:function(){
        var args=Array.prototype.slice.call(arguments)
        args.forEach(function(entry){
            this.sum+=entry
            ++this.count
        },this) // forEach 함수의 인자인 콜백함수가 this(thisArg)를 인자로 받아 바인딩되어
                // add 메서드의 this, 즉 report와 바인딩 된다.  
    },
    average:function(){
        return this.sum/this.count
    }
}
report.add(60,85,95)
console.log(report.sum,report.count,report.average())