var context;
var index=0;
var timer;
var isGameOver;
var velocity;
var velocity=10;
var score=0;
var isScore;
// 将三张小鸟图片放到一个路径
var birdArray=['images/0.gif','images/1.gif','images/2.gif'];
//创建游戏中需要的对象
//背景
var backGround=new BackGround(0,0,400,600,'images/bg.png');
//创建地板
var floor=new Floor(0,550,400,50,'images/ground.png');
var upPipe=new Pipe(0,0,100,150,'images/pipe.png');
var downPipe=new Pipe(0,400,100,150,'images/pipe.png');
var bird=new Bird(80,280,40,40);
window.onload=function(){
//拿到画布
var canvas=document.getElementById('canvas');
//获取上下文（画笔）
context=canvas.getContext("2d");
document.onkeyup=keyup;
document.onclick=gameAgain;
// 循环调用
timer=setInterval(drawAll,80);
}
function keyup(evt){
	evt ||window.event;
	var currenKey=evt.keyCode||evt.which||event.charCode;
	if(currenKey==38){
		bird.y-=80;
	}
	// alert(currenKey);
}
// 绘制函数
function gameAgain(){
	if(isGameOver){
	window.location.reload();

	}
}
function drawAll(){	
  backGround.drawBgImage();
  floor.drawFloorImage();
  upPipe.drawUppipe();
  downPipe.drawDownpipe();
  bird.drawBird();
  movePipe();
}
//背景图片的构造函数
function BackGround (x,y,width,height,src){

	this.x=x;
	this.y=y;
	this.width=width;
	this.height=height;

	//创建图片属性,创建对象的方式创建图片
	var bgImage=new Image();
	//给图片对象设置图片
	bgImage.src=src;
	this.image=bgImage;

	//添加画图的方法
	this.drawBgImage=function(){
		//画背景图
        //context.drawImage(图片对象,x,y,width,height);
    context.drawImage(backGround.image,backGround.x,backGround.y,backGround.width,backGround.height);
	}
}
//地板的构造函数
function Floor (x,y,width,height,src){

	this.x=x;
	this.y=y;
	this.width=width;
	this.height=height;

	//创建图片属性,创建对象的方式创建图片
	var bgImage=new Image();
	//给图片对象设置图片
	bgImage.src=src;
	this.image=bgImage;

	//添加画图的方法
	this.drawFloorImage=function(){
		//画背景图
        //context.drawImage(图片对象,x,y,width,height);
    context.drawImage(floor.image,floor.x,floor.y,floor.width,floor.height);
	}
}
function Pipe (x,y,width,height,src){

	this.x=x;
	this.y=y;
	this.width=width;
	this.height=height;

	//创建图片属性,创建对象的方式创建图片
	var bgImage=new Image();
	//给图片对象设置图片
	bgImage.src=src;
	this.image=bgImage;

	//添加画图的方法
	this.drawUppipe=function(){
	  //添加上面管道方法
	  	context.drawImage(upPipe.image,160,500,150,800,upPipe.x,upPipe.y,upPipe.width,upPipe.height);
	}
	this.drawDownpipe=function(){
	  //添加下面管道方法
     context.drawImage(downPipe.image,0,500,150,500,downPipe.x,downPipe.y,downPipe.width,downPipe.height);
	}
}
function Bird(x,y,width,height){
    this.x=x;
    this.y=y;
    this.width=width;
    this.height=height;
    this.drawBird=function(){
	var image=new Image();
	image.src=birdArray[index%3];
	index++;
    context.drawImage(image,bird.x,bird.y,bird.width,bird.height);
   };
}
function movePipe(){
	// bird.y=bird.y+10;
	bird.y+=10;
	if (upPipe.x+upPipe.width<=0&&downPipe.x+downPipe.width<0){
		upPipe.x=400;
		downPipe.x=400; 
		upPipe.height=Math.random()*200+100;
		downPipe.y=upPipe.height+200;
		downPipe.height=floor.y-downPipe.y;
		isScore=true;
	}else{
		// 每次减多少
		// upPipe.x=upPipe.x-10;
		upPipe.x-=velocity;
		// downPipe.x=downPipe.x-10;
		downPipe.x-=velocity;
	}
	var floorCondition=bird.y+bird.height>=floor.y+5;
	// 与上管道的碰撞
	var zuoShangJiaoCondition=(bird.x>=upPipe.x&&bird.x<=upPipe.x+upPipe.width)&&(bird.y>=0&&bird.y<=upPipe.y+upPipe.height)
	var youShangJiaoCondition=(bird.x+bird.width>=upPipe.x+20&&bird.x+bird.width<=upPipe.x+upPipe.width)&&(bird.y>=0&&bird.y<=upPipe.y+upPipe.height)
    // 与下管道的碰撞
    var zuoXiaJiaoCondition=(bird.x>=downPipe.x&&bird.x<=downPipe.x+downPipe.width)&&(bird.y+bird.height>=downPipe.y&&bird.y+bird.height<=downPipe.y+downPipe.height)
    var youXiaJiaoCondition=(bird.x+bird.width>=downPipe.x+20&&bird.x+bird.width<=downPipe.x+downPipe.width)&&(bird.y+bird.height>=downPipe.y&&bird.y+bird.height<=downPipe.y+downPipe.height)
    var ceilCondition=bird.y<=0;
	if (ceilCondition||floorCondition||zuoShangJiaoCondition||youShangJiaoCondition||zuoXiaJiaoCondition||youXiaJiaoCondition){
		// console.log('碰撞了');
		// alert("碰撞了");
		clearInterval(timer);
		isGameOver=true;
		context.fillStyle="orange";
		context.font="30px 宋体";
		context.fillText('当前分数为'+score+'分',100,100);

	}
	if(isScore&&bird.x>upPipe.x+upPipe.width){
        score++;
        if(score%3==0){
        	velocity+=5;
	     }
		isScore=false;
	}
	console.log(score);
}
