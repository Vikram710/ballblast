let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
canvas.width = canvas.scrollWidth;
canvas.height = canvas.scrollHeight;
let button1 = document.getElementById("start").addEventListener("click",play);
let button2 = document.getElementById("pause").addEventListener("click",paused);
let button3 = document.getElementById("restart").addEventListener("click",redo);
document.getElementById("restart").style.visibility='hidden';
document.getElementById("highscore").innerHTML="HIGH SCORE: "+localStorage.getItem("highscore");
var start=false;
var hitby=false;
var crash=false;
var calls=0;
var k=0;
var num_rocks=0;



class Cannon{

    constructor(x,y,width,height){
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;
        this.speed=0;
    }

    draw(ctx){
        ctx.fillStyle = "black";
        ctx.fillRect(this.x,this.y,this.width,this.height);
    }
    moveLeft(){
        this.speed=-10;
    }
    moveRight(){
        this.speed=+10;
    }
    update_c(){
        this.x+=this.speed;
        if(this.x+this.width>480){
            this.x=480-this.width;
        }
        if(this.x<0){
            this.x=0;
        }
        
    }
    clear(){
        this.speed=0;
    }
}

class Input{
    constructor(){
      document.addEventListener("keydown",(event)=>{
        switch(event.keyCode){
          case 37:
           cannon.moveLeft();
            break;
          case 39:
              cannon.moveRight();
            break;
  
        }
      });
      document.addEventListener("keyup",(event)=>{
        switch(event.keyCode){
          case 37:
           cannon.clear();
            break;
          case 39:
              cannon.clear();
            break;
  
        }
      });
    }
}

class Bullet{
    constructor(x,y,radius){    
        this.x=x;
        this.y=y;
        this.radius=radius;
        this.speed=0
    }
    draw(ctx){
        ctx.fillStyle="red";
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.radius,0,Math.PI*2);
        ctx.fill();
        ctx.closePath();
    }
    update_b(){
        if (temp_score<20){
            this.speed=5;
          }
          else if(temp_score<40){
            this.speed=10;
          }
          else if(temp_score<70){
            this.speed=13;
          }
          else{
            this.speed=16;
          }
        this.y-=this.speed;
        
    }

}

class Rock{
    constructor(x,y,radius){
        this.x=x;
        this.y=y;
        this.strength=radius
        this.truerad=radius;
        if(radius<40){
            this.radius=radius+20;
        }
        else{
            this.radius=radius;
        }
        this.speedx=2;
        this.speedy=3;
        this.gravity=0.3;
        this.call=0;
    }
    draw(ctx){
        ctx.fillStyle="green";
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.radius,0,Math.PI*2);
        ctx.fill();
        ctx.closePath();
        ctx.fillStyle="white"
        ctx.font= this.radius+"px Arial";
        if(this.strength<10){
        ctx.fillText(this.strength,this.x-this.radius/4,this.y+this.radius/4.5);
        }
        else if(this.strength<100){
        ctx.fillText(this.strength,this.x-this.radius/2,this.y+this.radius/2.5);
        }
        else
        {ctx.fillText(this.strength,this.x-this.radius/1.3,this.y+this.radius/3);}
    }
    update_r(ctx){
        this.x+=this.speedx;
        this.y+=this.speedy;
        this.gravityspeed += this.gravity;
        if(this.x+this.radius>480){
            this.x=480-this.radius;
            this.speedx=-1*this.speedx;
        }

        if(this.y+this.radius>480){
            this.speedy=-1*this.speedy;
        }
        else{
            this.speedy+=this.gravity;
        }
        if(this.x-this.radius<0 && start){
            this.x=this.radius;
            this.speedx=-1*this.speedx;
        }
        
        if(this.strength<=0 &&this.call==1){
            this.x=5000;
            
        }


    }
    hitBy(bullet){
        if(this.x+this.radius > bullet.x+bullet.radius && this.x-this.radius < bullet.x-bullet.radius
            && this.y+this.radius > bullet.y+bullet.radius && this.y-this.radius < bullet.y-bullet.radius){
                hitby=true;
            }
            return hitby;
    }
    crashWith(cannon){
        
        if(this.x-this.radius<cannon.x+cannon.width && this.x+this.radius>cannon.x &&
            this.y-this.radius<cannon.y+cannon.height && this.y+this.radius>cannon.y)
            { crash=true;}
            return crash;
    }


}

class Score{
    constructor(x, y){
      this.x = x;
      this.y = y;
    }
    draw(ctx){
      ctx.font="20px Arial";
      ctx.fillStyle= "black";
      ctx.fillText(this.text, this.x, this.y);
    }
  }

new Input();
var cannon = new Cannon(240,430,50,80);
var bullets = [];
var rocks = [];
var score = new Score(350, 30);
var count=-1;
var temp_score;

function updategame(){ 
    if(pause){
        return;
    }
    for(var i=0;i<rocks.length;i++){
        
    if(rocks[i].crashWith(cannon)){
        document.getElementById("restart").style.visibility='visible';
        //adf
        store(temp_score);
        return;
    }
}
    
    
    ctx.clearRect(0,0,canvas.width,canvas.height);
    count+=1;
    start=true;

    for(var i =0; i < bullets.length;i++){
        for(var j =0; j<rocks.length;j++){
        if (rocks[j].hitBy(bullets[i])){
            rocks[j].strength-=1;
            //i used splice here gave an error saying  property of bullets[i] isnt defined . like property x etc. 
            bullets[i].x=1000;
            hitby=false;
        }
    }
    }

    cannon.update_c();
    cannon.draw(ctx);

    for ( var i = 0; i<bullets.length; i++){
        bullets[i].update_b();
        bullets[i].draw(ctx);

      }

      if(count%10==0){
      bullets.push(new Bullet(cannon.x+(cannon.width/2),cannon.y,8));
      }

    for (var i = 0; i<rocks.length; i++){

        if(rocks[i].strength<=0 &&rocks[i].call==0){
            rocks.push(new Rock(rocks[i].x+60,40,Math.floor(rocks[i].truerad/2)));
            rocks.push(new Rock(rocks[i].x-60,40,Math.floor(rocks[i].truerad/2)));
            rocks[i].call=1; 
            rocks[i+2-num_rocks].call=1;
            rocks[i+3-num_rocks].call=1;           
        }
        rocks[i].update_r(ctx);
        rocks[i].draw(ctx);
    }
    
    var min=20;
    var max=60;
    var rnd=Math.floor((max-min)*Math.random()+min);
    if(count%1200==0){
        num_rocks+=1;
        if(Math.random()>0.5){
        rocks.push(new Rock(520,50,rnd));
    }
        else{
            rocks.push(new Rock(-50,50,rnd));
        }
    }
    
    temp_score=Math.floor(count/63);
    score.text="SCORE: " + temp_score;
    score.draw(ctx);

    setTimeout(updategame,16);
}


function paused(){
    document.getElementById("start").innerHTML="RESUME";
    calls-=1;
    return pause=!pause , k=0;
  }
function play(){
    calls+=1;
    pause=false;
    k=k+1;
    if (k==1){
      document.getElementById("start").innerHTML="PLAY";
      updategame(); 
  
    }
   
  }
function redo(){
    if(crash){
    start=false;
    hitby=false;
    crash=false;
    calls=0;
    k=0;
    bullets = [];
    rocks = [];
    count=-1;
    temp_score=0;
    }
    document.getElementById("restart").style.visibility='hidden';
    play();
  }
function store(score){
    if(score>localStorage.getItem("highscore")){
        localStorage.setItem("highscore", score);
    }
    document.getElementById("highscore").innerHTML="HIGH SCORE: "+localStorage.getItem("highscore");
}

