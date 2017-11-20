var planeDiv;
// 背景图片Y坐标
var backgroundY=0;
// 控制创建飞机时间
var time1=0;
var time2=0;
// 敌方飞机数组
var enemyArr=[];
var bulletArr=[];
var myPlane;
var timer;
var body;
var suspendDiv;
// 判断是否暂停状态
var isPause=false;
// 结束界面
var enddiv;
// 总分数
var plane_Score=0;
var planeScore;
var scoreSpan;
window.onload=function(){
  var beginButton=document.getElementById('beginButton');
  // 拿到开始游戏盒子
  var beginDiv=document.getElementById('beginDiv');
  planeDiv=document.getElementById('planeDiv');
  body=document.getElementsByTagName('body')[0];
  suspendDiv=document.getElementById('suspendDiv');
  enddiv=document.getElementById('enddiv');
  planeScore=document.getElementById('planeScore');
  scoreSpan=document.getElementById('score');
  // 添加点击事件
  beginButton.onclick=function(){
     // 切换两个盒子的display
      beginDiv.style.display='none';
      // 显示打飞机的盒子
      planeDiv.style.display='block';	
     
     timer= setInterval(movingBG,30)
    }
    // 创建本方飞机
     myPlane=new MyPlane(127,480);

    // 创建敌方飞机
    // 添加鼠标移动事件
    addEvent(planeDiv,'mousemove',moveAirPlane);
    addEvent(body,'mousemove',moveBoder);
    // 添加点击事件
    addEvent(myPlane.imgNode,'click',suspendPlane);
    // 给暂停添加事件
    addEvent(suspendDiv.getElementsByTagName('button')[0],'click',suspendPlane);
    // 重新开始按钮
    addEvent(suspendDiv.getElementsByTagName('button')[1],'click',replay);
}
// 重新开始按钮
function replay(){
	// 刷新界面
	window.location.reload();
}
// 移动飞机
function moveAirPlane(evt){
	// 兼容ie拿到事件
	evt=evt||window.event;
	// 盒子左上角到浏览器左边距离
	var distance=(document.body.clientWidth-320)/2;
	var ourAirPlane=myPlane.imgNode;
	// 改变飞机left与top
	ourAirPlane.style.left=evt.clientX-distance-33+'px';
	ourAirPlane.style.top=evt.clientY-40+'px';

}
// 边界判断函数
function moveBoder(evt){
	evt=evt||window.event;
	var bodyX=evt.clientX;
	var bodyY=evt.clientY;
	var distance=(document.body.clientWidth-320)/2;
	if(bodyX<distance||bodyX>(distance+320)||bodyY<0||bodyY>568){
		removeEvent(planeDiv,'mousemove',moveAirPlane);
	}else{
       addEvent(planeDiv,'mousemove',moveAirPlane);
     }
}
function suspendPlane(){
	if(isPause){
       // 恢复循环调用函数
       timer= setInterval(movingBG,30);
       // 恢复移动事件添加
      addEvent(planeDiv,'mousemove',moveAirPlane);
      addEvent(body,'mousemove',moveBoder);
      suspendDiv.style.display='none';
      // 处于非暂停状态
      isPause=false;
	}else{
	    clearInterval(timer);
	    suspendDiv.style.display='block';
        removeEvent(planeDiv,'mousemove',moveAirPlane);
        removeEvent(body,'mousemove',moveBoder);
        isPause=true;
        }
}
// 移动背景图片
function movingBG(){
	// 获取Y坐标
  planeDiv.style.backgroundPositionY=backgroundY+'px';
  // 进行背景移动
  backgroundY+=0.5;
     if(backgroundY==568){
  	 backgroundY=0;
     }
     // 飞机创建间隔时间
     time1++;
     if(time1==20){
         time2++;
         if(time2%5==0){
   	      var middlePlane=new EnemyPlane(274,-100,46,60,'image/enemy3_fly_1.png','image/中飞机爆炸.gif',2,200,6,200)
   	      // 加入数组
   	      enemyArr.push(middlePlane);
         }
         if(time2==20){
   	       // 创建大型飞机
   	       var largePlane=new EnemyPlane(210,-100,110,164,'image/enemy2_fly_1.png','image/大飞机爆炸.gif',1,300,12,300)
   	       enemyArr.push(largePlane);
   	       time2=0;
         }else{
   	     // 创建小飞机
         var samllPlane=new EnemyPlane(286,-100,34,24,'image/enemy1_fly_1.png','image/小飞机爆炸.gif',3,100,1,100)
         enemyArr.push(samllPlane);
        }
    // 创建敌方飞机
   	time1=0;
   }
   // 敌机个数
   var enemyPlaneLength=enemyArr.length;
   // 遍历敌方数组
   for(var i=0;i<enemyPlaneLength;i++){
   	 var enemyPlane=enemyArr[i];
   	 if(!enemyPlane.planeisdie){
   	    // 调用下移方法
   	    enemyPlane.movePlane();
        }else {
        	enemyPlane.dieBeginTimer+=10;
        	if(enemyPlane.dieBeginTimer==enemyPlane.dieBeginTimer){
    	     // 飞机死亡，爆炸
    	     planeDiv.removeChild(enemyPlane.imgNode);
    	     enemyArr.splice(i,1);
    	     enemyPlaneLength--;
    	    }
        }
       // 敌机超出边界则删除
     if(enemyPlane.imgNode.offsetTop>=568){
        planeDiv.removeChild(enemyPlane.imgNode);
        // 敌方飞机数组里面移除此对象
        enemyArr.splice(i,1);
        enemyPlaneLength--;
        }
      }
     if(time1%3==0){
     // 创建子弹
       var bullet=new Bullet(myPlane.imgNode.offsetLeft+31,myPlane.imgNode.offsetTop-10);
       bulletArr.push(bullet);
     }
     var bulletLength=bulletArr.length;
     for(var i=0;i<bulletLength;i++){
    	var bullet1=bulletArr[i];
    	// 移动子弹
   	     bullet1.moveBullet();
   	     if(bullet1.bulletImage.offsetTop<=0){
   	         // 移除子弹结点
   	         planeDiv.removeChild(bullet1.bulletImage);
   	        // 数组移除元素
   	         bulletArr.splice(i,1);
   	         bulletLength--;
   	         }
    }
    // 碰撞判断
    for(var i=0;i<bulletLength;i++){
    	for(var j=0;j<enemyPlaneLength;j++){
    		// 飞机与敌机的碰撞
    		if(enemyArr[j].planeisdie==false){
    			if(myPlane.imgNode.offsetLeft<=enemyArr[j].imgNode.offsetLeft+enemyArr[j].planeWidth&&myPlane.imgNode.offsetLeft+myPlane.planeWidth>=enemyArr[j].imgNode.offsetLeft){
    				if(myPlane.imgNode.offsetTop<=enemyArr[j].imgNode.offsetTop+enemyArr[j].planeHeight&&myPlane.imgNode.offsetTop+myPlane.planeHeight>=enemyArr[j].imgNode.offsetTop){
    					 // 停止循环调用
    					 clearInterval(timer);
    					 removeEvent(planeDiv,'mousemove',moveAirPlane);
                         removeEvent(body,'mousemove',moveBoder);
                         // 移除点击事件
                         removeEvent(myPlane.imgNode,'click',suspendPlane);
                         // 显示结束界面
                         enddiv.style.display='block';
                         // 设置分数
                         planeScore.innerHTML=plane_Score;
                         // 飞机死亡，爆炸
                         myPlane.imgNode.src=myPlane.boomImgSrc;
    				}
    			}
    			// 接受子弹
    			var everyBullet=bulletArr[i].bulletImage;
    			var everyEnemy=enemyArr[j].imgNode;
    			// 子弹与敌机碰撞
    			var x1=everyBullet.offsetLeft+6>=everyEnemy.offsetLeft;
    			var x2=everyBullet.offsetLeft<=everyEnemy.offsetLeft+enemyArr[j].planeWidth;
    			var y1=everyBullet.offsetTop+14>=everyEnemy.offsetTop;
    			var y2=everyBullet.offsetTop<=everyEnemy.offsetTop+enemyArr[j].planeHeight;
    			if(x1&&x2){
    				if(y1&&y2){
                       enemyArr[j].blood-=bulletArr[i].attack;
                       if(enemyArr[j].blood==0){
                       	// 敌机死亡
                       	// 分数改变
                       	plane_Score+=enemyArr[j].score;
                       	// 改变左上角分数
                       	scoreSpan.innerHTML=plane_Score;
                       	// 敌方飞机图片改变
                       	enemyArr[j].imgNode.src=enemyArr[j].boomImgSrc;
                       	enemyArr[j].planeisdie=true;
                       }
                       // 删除子弹
                       planeDiv.removeChild(everyBullet);
                       // 子弹数组减一
                       bulletArr.splice(i,1);
                       bulletLength--;
                       // 跳出本次循环
                       break;
    				}
    			}
    		}
    	}
    }
}
// 飞机构造函数
function Plane(x,y,width,height,imgSrc,boomImgSrc,speed,dieTime,blood,score){
	// x,y,width
	this.planeX=x;
	this.planeY=y;
	this.planeWidth=width;
	this.planeHeight=height;
	// 爆炸图片地址
	this.boomImgSrc=boomImgSrc;
	this.speed=speed;
	this.dieTime=dieTime;
	// 血量
	this.blood=blood;
	this.score=score;
	this.planeisdie=false;
	this.dieBeginTimer=0;
	// 创建图片
	this.init=function(){
		this.imgNode=document.createElement('img');
		this.imgNode.src=imgSrc;
		// 飞机显示位置
		this.imgNode.style.top=this.planeY+'px';
		this.imgNode.style.left=this.planeX+'px';
		// 添加子节点
		planeDiv.appendChild(this.imgNode);

	};
	// 显示图片
	this.init();
	// 自动下移改变top值
	this.movePlane=function(){
		// offsetTop:100
        this.imgNode.style.top=this.speed+this.imgNode.offsetTop+'px';
	};
}
// 创建本方飞机
function MyPlane(x,y){
	// 冒充对象call(要冒充的对象,被冒充对象形参)
	Plane.call(this,x,y,66,80,'image/我的飞机.gif','image/本方飞机爆炸.gif',0,9999,1,1);
}
// 创建敌方飞机
function EnemyPlane(max,y,width,height,imgSrc,boomImgSrc,speed,dieTime,blood,score){
	Plane.call(this,random(max),y,width,height,imgSrc,boomImgSrc,speed,dieTime,blood,score);
}
// 求敌方飞机随机数
function random(max){
	return Math.random()*max;
}
function Bullet(x,y){
	this.bulletX=x;
	this.bulletY=y;
	this.bulletWidth=6;
	this.bulletHeight=14;
	this.attack=1;
	this.init=function(){
		this.bulletImage=document.createElement('img');
		this.bulletImage.style.top=this.bulletY+'px';
		this.bulletImage.style.left=this.bulletX+'px';
		this.bulletImage.src='image/bullet1.png';
		planeDiv.appendChild(this.bulletImage);
	};
	this.init();
	// 子弹向上移动
	this.moveBullet=function(){
        this.bulletImage.style.top=this.bulletImage.offsetTop-20+'px';
	};
}
// 跨浏览器添加事件
function addEvent(obj,type,fn){
	if(obj.addEventListener){
		obj.addEventListener(type,fn,false);
	}else if(obj.attachEvent){
		obj.attachEvent('on'+type,fn);
	}
}
// 跨浏览器删除事件
function removeEvent(obj,type,fn){
	if(obj.removeEventListener){
		obj.removeEventListener(type,fn,false);
	}else if(obj.detachEvent){
		// ie移除事件
		obj.detachEvent('on'+type,fn);
	}
}