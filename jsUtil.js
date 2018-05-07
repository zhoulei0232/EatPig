var JsUtil = {
    //通用的继承方法
    extends:function(origin){
        var result = function(){
            origin.apply(this,arguments)
        }
        function F(){};
        F.prototype = origin.prototype;
        result.prototype = new F();
        return result;
    },
    single : function(){
        var result = function(){
            if(typeof result.instance ==="object"){
                return result.instance
            }
            result.instance = this ;
            return this;
        }
        return result
    }
}