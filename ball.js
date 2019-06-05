let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
canvas.width = canvas.scrollWidth;
canvas.height = canvas.scrollHeight;
var start=false;
var hitby=false;
var crash=false;

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
    }
    draw(ctx){
        ctx.fillStyle="red";
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.radius,0,Math.PI*2);
        ctx.fill();
        ctx.closePath();
    }
    update_b(){
        this.y-=5;
        
    }

}

class Rock{
    constructor(x,y,radius){
        this.x=x;
        this.y=y;
        this.radius=radius;
        this.speedx=2;
        this.speedy=3;
        this.gravity=0.3;
        this.strength=radius
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
    update_r(){
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
        
        if(this.strength<=0){
            this.x=5000;
            this.y=5000;
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

var count=0;
var temp_score;

function updategame(){
    
    for(var i=0;i<rocks.length;i++){
    if(rocks[i].crashWith(cannon)){
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
            bullets[i].x=5100;
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
      bullets.push(new Bullet(cannon.x+(cannon.width/2),cannon.y,10));
      }

    for (var i = 0; i<rocks.length; i++){
        rocks[i].update_r();
        rocks[i].draw(ctx);
    }
    
    if(count%600==0){
        rocks.push(new Rock(-50,50,50));
    }
    
    temp_score=Math.floor(count/63);
    score.text="SCORE: " + temp_score;
    score.draw(ctx);

    setTimeout(updategame,16);
}
updategame();