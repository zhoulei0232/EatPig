var X_LEN = 30;
var Y_LEN = 30;
var SQUARE_WIDTH = 30;
//棋盘在屏幕的位置
var BASE_X = 100 ;
var BASE_Y = 10 ; 

var SPEED = 500 ; //蛇的速度
//方格
function Square(x1,y1){
    this.x = x1;
    this.y = y1;
    this.view = null ;
    this.width = SQUARE_WIDTH;
    this.height = SQUARE_WIDTH;
}
//实现touch方法
Square.prototype.touch =function(){}
//地板
var Floor = JsUtil.extends(Square);
//食物
var Food = JsUtil.extends(Square);
//障碍物
var Stone = JsUtil.extends(Square);
//墙
var Wall = JsUtil.extends(Square);
//蛇身
var SnackBody = JsUtil.extends(Square);
//蛇头
var SnackHead = JsUtil.extends(Square);

var Snack = JsUtil.single() ;
var Ground = JsUtil.single() ;
var Game = JsUtil.single() ;

//方法集合
var TouchEventEnum = {
    MOVE :'Move',
    EAT :'Eat',
    DEAD : 'Dead'
}
var game = new Game();
game.score = 0;
game.timer = null;
game.ground = null ;
game.snack = null ;
game.food = null ;

game.init =function(){
    //初始化广场
    var gameGround = new Ground();
    gameGround.init();
    this.ground = gameGround;
    //初始化蛇
    var gameSnack = new Snack();
    gameSnack.init(gameGround);
    this.snack = gameSnack;
    var gameFood = new Food();
    // gameFood.init()
    // console.log(gameFood.init)
}
game.over =function(){
    alert('游戏结束,分数为'+game.score);
    clearInterval(game.timer);
  
}
game.run = function(){
    this.timer =setInterval(function(){
        var result =game.snack.move(game);
    },SPEED)
    document.onkeydown =function(e){
        var keyNum = window.event?e.keyCode :e.which;
        if(keyNum == 38 && game.snack.direction != DirectionEnum.DOWN){
            game.snack.direction = DirectionEnum.UP;
        }
        if(keyNum == 40 && game.snack.direction != DirectionEnum.UP){
            game.snack.direction = DirectionEnum.DOWN;
        }
        if(keyNum == 37 && game.snack.direction != DirectionEnum.RIGHT){
            game.snack.direction = DirectionEnum.LEFT;
        }
        if(keyNum == 39 && game.snack.direction != DirectionEnum.LEFT){
            game.snack.direction = DirectionEnum.RIGHT;
        }
    }
}

var ground = new Ground();
ground.squareTable = new Array(Y_LEN);
ground.xLen = X_LEN;
ground.yLen = Y_LEN;
// 初始起点 x,y值
ground.basePointX = BASE_X;
ground.basePointY = BASE_Y;
//定义一下广场的视图
ground.view = null ;
ground.init = function(){
    var viewGround =document.createElement('div');
    viewGround.style.position = 'relative';
    viewGround.style.height = this.xLen *SQUARE_WIDTH + 'px';
    viewGround.style.width = this.yLen *SQUARE_WIDTH + 'px';
    viewGround.style.display = 'inline-block';
    viewGround.style.left = this.basePointX+'px';
    viewGround.style.top = this.basePointY+'px';
    viewGround.style.background = 'green';
    document.body.appendChild(viewGround);
   
    //开始造墙
    for(var i=0;i<this.yLen;i++){
        for(var j=0 ;j<this.xLen ;j++){
            var square;
            if(j==0){
                this.squareTable[i] =new Array(this.xLen)
            }
            if(i==0 || j==0 ||i==this.xLen-1 || j == this.yLen-1){
                square = SquareFactory.create('Wall',j,i)
            }else{
                square = SquareFactory.create('Floor',j,i)
            }
            this.squareTable[i][j] =square;
            // console.log(square.view);
            viewGround.appendChild(square.view)
        }
    }
    this.view = viewGround
}
//拆地板
ground.remove = function(x,y){
    this.view.removeChild(this.squareTable[y][x].view)
    this.squareTable[y][x] = null ;

}
//装地板
ground.append = function(x,y,square){
    this.squareTable[y][x] = square ;
    this.view.appendChild(this.squareTable[y][x].view)
}
//工厂方法
function SquareFactory(){}
SquareFactory.create =function(type,x,y){
    if( typeof SquareFactory[type] !=='function'){
        console.log(type)
        throw 'Error'
    }
    var result =SquareFactory[type](x,y);
    return result;
}
//floor food wall snackhead snackbody 5种情况
SquareFactory.commonInit = function(obj,x1,y1,color,touchEvent,myurl){
     obj.x = x1;
     obj.y = y1;
     obj.view = document.createElement('div');
     obj.view.style.position='absolute';
     obj.view.style.display = 'inline-block';
     obj.view.style.width =SQUARE_WIDTH + 'px';
     obj.view.style.height =SQUARE_WIDTH + 'px';
     obj.view.style.background =color;
     obj.view.style.left =obj.x *SQUARE_WIDTH+ 'px' ;
     obj.view.style.top =obj.y *SQUARE_WIDTH+ 'px' ;
     obj.view.style.backgroundImage =myurl;
     obj.view.style.backgroundSize ="30px 30px";
     obj.touch =function(){
         return touchEvent;
     }
}
SquareFactory.Floor = function(x1,y1){
    var floor = new Floor();
    this.commonInit(floor,x1,y1,'orange',TouchEventEnum.MOVE,'');
    return floor
}
SquareFactory.Wall = function(x1,y1){
    var wall = new Wall();
    this.commonInit(wall,x1,y1,'black',TouchEventEnum.DEAD,'');
    return wall
}
SquareFactory.Food = function(x1,y1){
    var food = new Food();
    this.commonInit(food,x1,y1,'yellow',TouchEventEnum.EAT,'');
    return food
}

SquareFactory.SnackHead = function(x1,y1){
    var snackhead= new SnackHead();
    this.commonInit(snackhead,x1,y1,'orange',TouchEventEnum.DEAD,'url(jpg/1.png)');
    return snackhead
}
SquareFactory.SnackBody = function(x1,y1){
    var snackbody= new SnackBody();
    this.commonInit(snackbody,x1,y1,'orange',TouchEventEnum.DEAD,'url(jpg/2.png)');
    return snackbody
}
SquareFactory.Stone = function(x1,y1){
    var stone= new Stone();
    this.commonInit(stone,x1,y1,'black',TouchEventEnum.DEAD,'');
    return stone
}
// 蛇的方法
var snack = new Snack();
snack.head = null ;
snack.tail = null ;
//蛇的行走方向
snack.direction = 0
var DirectionEnum = {
    UP :{x:0 , y:-1},
    DOWN:{x:0 , y:1},
    LEFT:{x:-1 , y:0},
    RIGHT:{x:1 , y:0}
}
snack.init = function(gameGround){
    var tempHead = SquareFactory.create('SnackHead',3,1);
    var tempBody1 = SquareFactory.create('SnackBody',2,1);
    var tempBody2 = SquareFactory.create('SnackBody',1,1);
    gameGround.remove(3,1);
    gameGround.append(3,1, tempHead );
    gameGround.remove(2,1);
    gameGround.append(2,1, tempBody1 );
    gameGround.remove(1,1);
    gameGround.append(1,1, tempBody2 );
    //链表数据来实现蛇的操控
    tempHead.next = tempBody1;
    tempHead.last = null ;
    
    tempBody1.next = tempBody2;
    tempBody1.last = tempHead ;

    tempBody2.next = null;
    tempBody2.last =tempBody1;
    
    this.head = tempHead;
    this.tail = tempBody2;
    this.direction =DirectionEnum.RIGHT;
}
console.log(game)
snack.move = function (game){
    
    var square = game.ground.squareTable[this.head.y + this.direction.y][this.head.x +this.direction.x]
    // console.log(this.strategy[square.touch()] )
   
    if(typeof this.strategy[square.touch()] == "function"){
        this.strategy[square.touch()](game,this,square,false)
    }
}
snack.strategy = {
    Move:function(game , snack ,square,formEat){
        console.log('55555555555')
        var tempHead = snack.head.next;
        var newBody = SquareFactory.create('SnackBody',snack.head.x,snack.head.y);
        newBody.next = tempHead ;
        tempHead.last = newBody ;
        tempHead = newBody ;
        game.ground.remove(snack.head.x,snack.head.y)
        game.ground.append(tempHead.x,tempHead.y,tempHead)
        var newHead = SquareFactory.create('SnackHead',square.x,square.y)
        newHead.next = tempHead ;
        tempHead.last = newHead ;
        game.ground.remove(square.x , square.y)
        game.ground.append(square.x , square.y ,newHead);
        snack.head = newHead;
        snack.head.last = null ;
        if(!formEat ){
            var floor = SquareFactory.create('Floor',snack.tail.x,snack.tail.y)
            game.ground.remove(floor.x , floor.y)
            game.ground.append(floor.x ,floor.y ,floor)
            snack.tail = snack.tail.last;
            snack.tail.next =null;
        }
    },
    Eat:function(game , snack ,square){
        game.score++;
        this.Move(game,snack ,square,true)
        // var food = new Food();
        // food.init(game.ground,game)
    },
    Dead:function(){
        game.over()
    }
}
var food =new Food();
food.init = function(gameGround){
    
    var newFood = SquareFactory.create('Food',4,6)
    gameGround.remove(4 , 6)
    gameGround.append(4 ,6 ,newFood)
}
console.log(food)
// if(condition) {
//     function xxx(){

//     }
// }else{
//     function yyy(){

//     }
// }