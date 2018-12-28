// consts
const K_LEFT = 37;
const K_UP = 38;
const K_RIGHT = 39;
const K_DOWN = 40;

// colours
const C_BACKG = '#222';
var ballColours = [
    '#F25F5C',
    '#FFE066',
    '#70C1B3',
    '#DD9892',
    '#C9ADA7',
    '#E07A5F',
    '#81B29A',
    '#F2CC8F',
    '#E1CE7A',
    '#778DA9',
]

// engine vars
var t = 0; //gametime
var speed = 1; //gamespeed
var fps = 120;//max is 1000
var f = 1000.0/fps*speed;

// control vars
var downKeys = {}; // key: Key code, value: down/up

// ball/physics vars
var balls = [];//list of ball objects
var g = 0.001; //gravity

// player vars
var playerx = 0;
var playerw = 0;
var playerh = 0;

var c = document.getElementById('c'),
cx = c.getContext('2d');

//#region updating
function updateBalls(){
    for(var i=0; i<balls.length; i++){
        var ball=balls[i];
        //wall collisions
        if(ball.y+ball.vy*f+ball.r>c.height){
            ball.y=c.height-ball.r;
            ball.vy*=-0.99; //not 100% efficient energy transfer
        }
        else if(ball.y-ball.r<0){
            ball.y=ball.r;
            ball.vy*=-0.99;
        }
        if(ball.x+ball.vx*f+ball.r>c.width){
            ball.x=c.width-ball.r;
            ball.vx*=-1;
        }else if(ball.x-ball.r<0){
            ball.x=ball.r;
            ball.vx*=-1;
        }

        //updt vels
        ball.x=ball.x+ball.vx*f;
        ball.y=ball.y+ball.vy*f;

        ball.vy=ball.vy+g*f;
    }
}
//#endregion

//#region drawing
function drawBall(ball){
    cx.fillStyle = ball.colour;
    cx.beginPath();
    cx.arc(ball.x, ball.y, ball.r, 0, 2 * Math.PI);
    cx.closePath();
    cx.fill();
}

function drawBalls(){
    for(var i=0; i<balls.length; i++){
        drawBall(balls[i]);
    }
}

function drawPlayer(){
    cx.strokeStyle = C_BACKG;

    cx.beginPath();
    cx.lineWidth = 3;

    var body = c.height; // y coord base of body
    var bodh = 60; // body height
    var bodw = 15; // body width

    // head
    var headw = 15;
    var headh = 10;

    cx.moveTo(playerx+headw,body-bodh-headh/2);
    cx.fillStyle = '#C9ADA7';
    cx.beginPath();
    cx.ellipse(playerx,body-bodh-headh/2,headw,headh,0,0,7);
    cx.closePath();
    cx.fill();
    cx.stroke();

    // body
    cx.fillStyle = '#9A8C98';
    cx.beginPath();
    cx.moveTo(playerx-bodw,body);
    cx.ellipse(playerx,body-bodh/2,bodw,bodh/2,0,Math.PI,2*Math.PI);
    cx.lineTo(playerx+bodw,body);
    cx.closePath();
    cx.fill();
    cx.stroke();

    // hat
    var hatw = bodw*1.3; // half hat width
    var hatt = 10; // hat thickness
    var hath = 8; // hat height
    var haty = body-bodh-2*headh/2; // y coord base of hat

    // hat base line
    cx.moveTo(playerx+hatw,haty);
    cx.fillStyle = '#4A4E69';
    cx.beginPath();
    cx.lineTo(playerx-hatw,haty);
    
    // hat above
    var div = 1.5; // determines width of triangle tip
    cx.lineTo(playerx-hatw,haty-hatt) // up
    cx.lineTo(playerx-hatw/div,haty-hatt); // right
    cx.lineTo(playerx,haty-hatt-hath); // tip
    cx.lineTo(playerx+hatw/div,haty-hatt); //down
    cx.lineTo(playerx+hatw,haty-hatt); //right
    cx.lineTo(playerx+hatw,haty); // down
    cx.closePath();
    cx.fill();
    cx.stroke();

    playerh = bodh + 2*headh + hath + 3;
    playerw = 2*hatw + 4;
}
//#endregion

//#region clearing
function clearAll(){
    //background
    cx.fillStyle = C_BACKG;
    cx.fillRect(0, 0, c.width, c.height);
}

function clearBall(ball){
    cx.fillStyle = C_BACKG;
    cx.fillRect(ball.x-ball.r-ball.w,ball.y-ball.r-ball.w,(ball.r+ball.w)*2,(ball.r+ball.w)*2);
}

function clearBalls(){
    for(var i=0; i< balls.length; i++){
        clearBall(balls[i]);
    }
}

function clearPlayer(){
    cx.fillStyle = C_BACKG;
    cx.fillRect(playerx-playerw/2,c.height-playerh,
                playerw,playerh);
}
//#endregion

function newBall(x,y,vx=0,vy=0,r=70,colour='#fff'){
    return {
      x:x,
      y:y,
      r:r,
      vx:vx,
      vy:vy,
      colour:colour,
      m:20,//mass
      w:2,//width
    }
}

function getRandomBallColour(){
    return ballColours[Math.floor(Math.random()*ballColours.length)];
}



(function() {        
  	function resizeCanvas() {
        c.width = window.innerWidth;
        c.height = window.innerHeight;

        clearAll();
    }
    window.addEventListener('resize', resizeCanvas, false);
    resizeCanvas();
    
    init();
    var timer=setInterval(function(){
      clear();
    	update();
      draw();
      t+=f;
    },f);
    
    function init(){
        // key listening
        window.addEventListener("keydown",function(e){
            downKeys[e.keyCode]=true;
        }, false);
        window.addEventListener("keyup",function(e){
            downKeys[e.keyCode]=false;
        }, false);

        clearAll();

        playerx = c.width/2; // center player
        balls.push(newBall(30,30,0.3,0,70,getRandomBallColour()));
    }
    
    function update(){
        if(downKeys[K_RIGHT]){
            playerx+=f/3;
        }
        if(downKeys[K_LEFT]){
            playerx-=f/3;
        }
        updateBalls();
    }
    
    function draw(){
        drawBalls();
        drawPlayer();
    }
    
    function clear(){
        clearPlayer();
        clearBalls();
    }
})();