/* 

    #############################################################
      
          @@@@@@@@@@    &&&&&&&&&&&&&&&&&&&    %%%%%%%%%%

(   By ~Aryan Maurya Mr.perfect https://amsrportfolio.netlify.app  )

          @@@@@@@@@@    &&&&&&&&&&&&&&&&&&&    %%%%%%%%%%

    #############################################################

*/

"use strict";
var canvas, ctx, width, height, mx, my, loop;
var snake;
var listElt;
var trail = [];
var obstacles = [];
var powerups = [];
var images = [{}, {}];
var gamemode = 0;
var frameCount = 0;
var scroll = 0;
var speed = 2.5;
var highscore = 0;
var score = 0;
var shield = 0;
var boost = -Infinity;
var skin = 0;
var colors = [["#999", "red"], 
["#6D9B2F", "orange"]];
var device = /Mobi/.test(navigator.userAgent);

var name = prompt("Now you can submit your score to the leaderboard(button in top right corner)\n\nWrite your name in this prompt to submit your score to the leaderboard or hit cancel to not submit\n\nleaderboard! (DON'T CHEAT!)");

var start = function () {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    setSize(canvas, innerWidth, innerHeight);
    
    ctx.fillStyle = "#333333";
    ctx.fillRect(0, 0, width, height);
    
    var imgs = document.getElementsByClassName("0");
    for(var i in imgs) {
        images[0][imgs[i].id] = imgs[i];
    }
    imgs = document.getElementsByClassName("1");
    for(var i in imgs) {
        images[1][imgs[i].id] = imgs[i];
    }
    
    snake = new Snake();
    
    window.addEventListener("resize", function () {
        setSize(canvas, innerWidth, innerHeight);
        ctx.fillStyle = "#333333";
        ctx.fillRect(0, 0, width, height);
    });
    
      canvas.addEventListener("touchstart", touchStart);
    if(!device) canvas.addEventListener("mousedown", mousePress)
    window.addEventListener("touchmove", touchMove);
    if(!device) window.addEventListener("mousemove", mouseMove);
    window.addEventListener("touchend", touchEnd);
    
    listElt = document.getElementById ("leaderboard");
    
    requestAnimationFrame(loop);
}
document.addEventListener("DOMContentLoaded", start);

var loop = function () {
    if (gamemode!=3 && gamemode!=4) {
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = "#333333";
        ctx.fillRect(0, 0, width, height);
    }
    
    if (gamemode == 3) {
        ctx.globalAlpha = 0.5;
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, width, height);
        ctx.globalAlpha = 1;
        ctx.fillStyle = "#fff";
        ctx.font = "35px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Paused", width/2, 50);
        ctx.font = "25px Arial";
        ctx.fillText("hold down your finger!", width/2, 90);
        gamemode++
    } else if(gamemode==0 || gamemode==2) {
        ctx.fillStyle = "#fff";
        ctx.font = "35px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Crazy Snake Attack:", width/2, 50);
        ctx.fillText("AmsRGameHub", width/2, 90);
        ctx.font = "20px Arial";
        ctx.fillText("Made by aryan0-1maurya", width/2, 120);
        ctx.drawImage(images[skin]["snake"], width/2-100, 130, 200, 200);
        ctx.font = (45+Math.sin(frameCount/10)*10) + "px Arial";
        ctx.fillText("Click To Start", width/2, 365+(Math.sin(frameCount/10)*5));
        ctx.fillStyle = colors[skin][0];
        ctx.fillRect(width/2-65, 380, 130, 35);
        ctx.font = "20px Arial";
        ctx.fillStyle = "#fff";
        ctx.fillText("Change Skin", width/2, 405);
        ctx.textAlign = "end";
        ctx.font = "25px Arial";
        ctx.fillStyle = "#ff0000";
        ctx.fillText("Tip: Avoid " + colors[skin][1], width-10, height-10);
        if(gamemode==2) {
            ctx.textAlign = "start";
            ctx.font = "25px Arial";
            ctx.fillStyle = "#00ff00";
            ctx.fillText("Score: " + Math.round(score), 10, height-10);
            ctx.textAlign = "center";
            ctx.fillText("Highscore: " + Math.round(highscore), width/2, height-50);
        }
    } else if(gamemode==1) {
    snake.update();
    if(frameCount%4==0) trail.push({x: snake.x, y:snake.y-scroll})
    ctx.lineWidth = 60;
    ctx.strokeStyle = colors[skin][0];
    ctx.beginPath();
    if(trail.length >0) ctx.moveTo(trail[0].x, height+30);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    for(var i=0; i<trail.length-1; i++) {
        ctx.lineTo(trail[i+1].x, trail[i+1].y+scroll);
        if(trail[i].y+scroll>height+40) {
            trail.splice(i, 1);
            i--;
        }
    }
    ctx.lineTo(snake.x, +snake.y)
    ctx.stroke();
    
    if(Math.random()*32000/(frameCount-boost<60*3 ? speed*5: speed)/width<1 && (frameCount-boost>60*3 || frameCount-boost<60*(3-(6/(speed*0.95))))) obstacles.push(new Obstacle(Math.random()*width));
    for(var i=0; i<obstacles.length; i++) {
        obstacles [i].draw();
        if(obstacles[i].y+scroll>height+30) {
            obstacles.splice(i, 1);
            i--;
        }
        else if(dist(snake.x, snake.y, obstacles[i].x, obstacles[i].y+scroll)<60) {
            if(frameCount-boost<60*3);
            else if(shield>0) {
                shield--;
                obstacles.splice(i, 1);
                i--;
            }
            else {
            gamemode = 2;
            score = scroll;
            scroll = 0;
            speed = 2.5;
            if(score > highscore ) highscore  = score ;
            obstacles = [];
            trail = [];
            powerups = [];
            if(typeof privateCode !== "undefined") privateCode.submitScore ();
            document.querySelector ("#button").style.visibility = "visible";
            document.querySelector ("#button").style["pointer-events"] = "auto";
            }
        }
    }
    
    if(Math.random()*1200/(1+speed/2)<1) powerups.push (new Powerup(Math.random()*width, ["shield", "boost"][Math.floor(Math.random()*1.5)]));
    for(var i=0; i<powerups.length; i++) {
        powerups [i].draw();
        if(powerups [i].y+scroll>height+30) {
            powerups.splice(i, 1);
            i--;
        }
        else if(dist(snake.x, snake.y, powerups [i].x, powerups[i].y+scroll)<60) {
            powerups[i].use();
            powerups.splice(i, 1);
            i--;
        }
    }
    
    snake.draw();
    
    ctx.textAlign = "center";
    ctx.font = "25px Arial";
    ctx.fillStyle = "#fff";
    if(shield > 0) {
        if(skin == 0) ctx.fillText("<"+shield+">", snake.x, snake.y+10);
        else if (skin == 1) ctx.fillText(shield, snake.x, snake.y+10);
    }
    ctx.textAlign = "start";
    ctx.fillStyle = "#00ff00";
    ctx.fillText("Score: " + Math.round(scroll), 10, height-10);
    
    speed += 0.0015;
    if(frameCount-boost<60*3) scroll += speed*5;
    else scroll += speed;
    }
    if(gamemode != 3) frameCount++;
    requestAnimationFrame(loop);
}

function circle (x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2*Math.PI);
    ctx.closePath();
    ctx.fill();
}

function setSize(canv, w, h) {
    canv.style.width = w + "px";
    canv.style.height = h + "px";
    
    width = w;
    height = h;
    
    canv.width = w*window.devicePixelRatio;
    canv.height = h*window.devicePixelRatio;
    
    canv.getContext("2d").scale (window.devicePixelRatio, window.devicePixelRatio);
}

/* 

    #############################################################
      
          @@@@@@@@@@    &&&&&&&&&&&&&&&&&&&    %%%%%%%%%%

(   By ~Aryan Maurya Mr.perfect https://amsrportfolio.netlify.app  )

          @@@@@@@@@@    &&&&&&&&&&&&&&&&&&&    %%%%%%%%%%

    #############################################################

*/

function dist(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x1-x2, 2) + Math.pow(y1-y2, 2))
}

function showBoard() {
    var div = listElt.parentElement;
    if(!div.style.visibility)  div.style.visibility = "hidden";
    if (div.style.visibility == "hidden") {
        div.style.visibility = "visible";
        div.style["pointer-events"] = "auto";
    } else {
        div.style.visibility = "hidden";
        div.style["pointer-events"] = "none";
    }
}

function touchStart(e) {
    var touches = e.changedTouches;
    
    mx = touches[0].clientX;
    my = touches[0].clientY;
    
    if (mx > width/2-65 && mx < width/2+65 && my>380 && my<415 && (gamemode == 0 || gamemode == 2)) {
        skin = (skin+1)%colors.length;
    } else if(gamemode!=1) {
        gamemode=1;
        document.querySelector ("#button").style.visibility = "hidden";
        document.querySelector ("#button").style["pointer-events"] = "none";
    }
}

function mousePress(e) {
    mx = e.clientX;
    my = e.clientY;
    
    if (mx > width/2-65 && mx < width/2+65 && my>380 && my<415 && (gamemode == 0 || gamemode == 2)) {
        skin = (skin+1)%colors.length;
    } else if(gamemode!=1) {
        gamemode=1;
        document.querySelector ("#button").style.visibility = "hidden";
        document.querySelector ("#button").style["pointer-events"] = "none";
    }
}

function touchMove(e) {
    let touches = e.changedTouches;
    
    mx = touches[0].clientX;
    my = touches[0].clientY;
}

function mouseMove(e) {
    mx = e.clientX;
    my = e.clientY;
}

function touchEnd(e) {
    let touches = e.changedTouches;
    
    mx = touches[0].clientX;
    my = touches[0].clientY;
    
    if(gamemode == 1) gamemode = 3;
}

class Snake {
    constructor() {
        this.x = width*0.5;
        this.y = height*0.8;
        var touching = true;
        while(touching) {
        touching = false;
        for(var i=0; i<obstacles.length; i++) {
            if(Math.abs(obstacles[i].y-this.y)<120) touching = true;
        }
        }
    }
    
    update () {
        this.y=height*0.8;
        if(this.x<mx) this.x += Math.min(Math.sqrt(Math.abs(this.x-mx)), Math.abs(this.x-mx));
        if(this.x>mx) this.x -= Math.min(Math.sqrt(Math.abs(this.x-mx)), Math.abs(this.x-mx));
    }
    
    draw () {
        ctx.fillStyle = colors[skin][0];
        circle(this.x, this.y, 30)
        ctx.drawImage(images[skin]["snake"],  this.x-30, this.y-30, 60, 60);
    }
}

class Obstacle {
    constructor(x) {
        this.x = x;
        this.y = -30-scroll;
        var count = width/120;
        while(count>=width/120) {
        count = 0;
        for(var i=0; i<obstacles.length; i++) {
            if(Math.abs(obstacles[i].y-this.y)<120) count++;
        }
        if(count>=width/120) this.y -= 180;
        }
    }
    
    draw () {
        ctx.drawImage(images[skin]["obstacle"],  this.x-30, this.y-30+scroll, 60, 60);
    }
}

class Powerup {
    constructor(x, type) {
        this.x = x;
        this.y = -30-scroll;
        this.type = type;
        var touch = true;
        var count = 0;
        while(touch && count < 100) {
            touch = false;
            for(var i=0; i<obstacles.length; i++) {
                if(Math.abs(obstacles[i].x-this.x)<60) touch = true;
            }
            if(touch) this.x = Math.random()*width;
            count++;
        }
    }
    
    draw () {
        if(this.type=="shield") {
            ctx.fillStyle = colors[skin][0];
            ctx.drawImage(images[skin]["shield"],  this.x-30, this.y-30+scroll, 60, 60);
        } else if(this.type=="boost") {
            ctx.fillStyle = colors[skin][0];
            circle(this.x, this.y+scroll, 30);
            ctx.fillStyle = "#fff";
            ctx.beginPath();
            ctx.moveTo (this.x, this.y+scroll-25);
            ctx.lineTo (this.x-25, this.y+scroll-5);
            ctx.lineTo (this.x-10, this.y+scroll-5);
            ctx.lineTo (this.x-10, this.y+scroll+25);
            ctx.lineTo (this.x+10, this.y+scroll+25);
            ctx.lineTo (this.x+10, this.y+scroll-5);
            ctx.lineTo (this.x+25, this.y+scroll-5);
            ctx.closePath();
            ctx.fill();
        }
    }
    
    use () {
        if(this.type=="shield") {
            shield++;
        } else if(this.type=="boost") {
            if(frameCount-boost<60*3) boost+=60*3
            else boost = frameCount;
        }
    }
}


/* 

    #############################################################
      
          @@@@@@@@@@    &&&&&&&&&&&&&&&&&&&    %%%%%%%%%%

(   By ~Aryan Maurya Mr.perfect https://amsrportfolio.netlify.app  )

          @@@@@@@@@@    &&&&&&&&&&&&&&&&&&&    %%%%%%%%%%

    #############################################################

*/