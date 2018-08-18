"use strict"
var socket = io('http://openwerewolf.us-west-2.elasticbeanstalk.com:8081');
//var socket = io();
var app = new PIXI.Application({
    width: 800,
    height: 600,
    backgroundColor: 0xd6d6d6
});
var Inputs = {
    LEFT: 'LEFT',
    RIGHT: 'RIGHT',
    DOWN: 'DOWN',
    UP: 'UP',
    NONE: 'NONE'
}
//app.stage.x = 350;
app.stage.y = 250;
const serverInterval = 100;
class Box {
    constructor(x, y) {
        let width = 50;
        let height = 50;
        this.graphics = new PIXI.Graphics();
        this.graphics.beginFill(0x000000);
        this.graphics.moveTo(x, y);
        this.graphics.lineTo(x + width, y);
        this.graphics.lineTo(x + width, y + height);
        this.graphics.lineTo(x, y + height);
        this.graphics.lineTo(x, y);
        this.graphics.endFill();
        this.graphics.x = 0;
        this.graphics.y = 0;
        app.stage.addChild(this.graphics);
    }
}
class Player {
    constructor(x, y, width, height) {
        this._input = [Inputs.NONE, Inputs.NONE];
        this._canJump = false;
        this._x = x;
        this._y = y;
        this._previousX = x;
        this._previousY = y;
        this._previousUpdateTime = performance.now();
        this._vx = 0;
        this._vy = 0;
        this.graphics = new PIXI.Graphics();
        this.graphics.beginFill(0xcc2222);
        this.graphics.moveTo(x, y);
        this.graphics.lineTo(x + width, y);
        this.graphics.lineTo(x + width, y + height);
        this.graphics.lineTo(x, y + height);
        this.graphics.lineTo(x, y);
        this.graphics.endFill();
        this.graphics.x = x;
        this.graphics.y = y;
        app.stage.addChild(this.graphics);

    }
    _setPosition(x, y) {
        this._previousUpdateTime = performance.now();
        this._previousX = this._x;
        this._previousY = this._y;
        this._x = x;
        this._y = y;
        //this.graphics.x = x;
        //this.graphics.y = y;
    }
    render(x, y) {
        let time = performance.now();
        let alpha = (time - this._previousUpdateTime) / serverInterval;
        //if (alpha > 1) {
        //  alpha = 1;
        //}
        let moveX = this._x * alpha + this._previousX * (1 - alpha) - this.graphics.x;
        let moveY = this._y * alpha + this._previousY * (1 - alpha) - this.graphics.y;
        this.graphics.x = this._x * alpha + this._previousX * (1 - alpha);
        this.graphics.y = this._y * alpha + this._previousY * (1 - alpha);
        return {
            moveX: moveX,
            moveY: moveY
        };
    }
    move(x, y) {
        this._x += x;
        this._y += y;
        this.graphics.x += x;
        this.graphics.y += y;
    }
    setXInput(input) {
        this._input[0] = input;
    }
    setYInput(input) {
        this._input[1] = input;
    }
    get xInput() {
        return this._input[0];
    }
    get yInput() {
        return this._input[1];
    }
    set vx(vx) {
        this._vx = vx;
    }
    set vy(vy) {
        this._vy = vy;
    }
    get vx() {
        return this._vx;
    }
    get vy() {
        return this._vy;
    }
    get x() {
        return this._x;
    }
    set x(x) {
        this._x = x;
        this._setPosition(this._x, this._y);
    }
    get y() {
        return this._y;
    }
    set y(y) {
        this._y = y;
        this._setPosition(this._x, this._y);
    }
}
document.getElementById('canvasContainer').appendChild(app.view);
var player = new Player(0, 0, 50, 50);
let players = [];
document.addEventListener('keydown', function (event) {
    console.log(event.keyCode);
    if (event.keyCode == 38) {
        //player.setYInput(Inputs.UP);
        socket.emit('input', Inputs.UP);
    }
    if (event.keyCode == 40) {
        //player.setYInput(Inputs.DOWN);
        socket.emit('input', Inputs.DOWN);
    }
    if (event.keyCode == 39) {
        //player.setXInput(Inputs.RIGHT);
        socket.emit('input', Inputs.RIGHT);
    }
    if (event.keyCode == 37) {
        //player.setXInput(Inputs.LEFT);
        socket.emit('input', Inputs.LEFT);
    }
});
socket.on('addPlayer', function (x, y) {
    players.push(new Player(x, y, 50, 50));
    console.log(x);
    console.log(y);
    console.log(players[players.length - 1]);
});
socket.on('removePlayer', function (i) {
    app.stage.removeChild(players[i].graphics);
    players.splice(i, 1);

});
socket.on('update', function (position) {
    player._setPosition(position.x, position.y);
});
socket.on('platforms', function (boxes) {
    console.log(boxes);
    for (let i = 0; i < boxes.length; i++) {
        new Box(boxes[i].position.x, boxes[i].position.y);
    }
});
socket.on('otherUpdate', function (list) {
    //console.log(players);
    //console.log(list);
    for (let i = 0; i < list.length; i++) {
        players[i]._setPosition(list[i].x, list[i].y);
    }
});
var delta = 0;
var lastFrameTime = 0;
var step = 1000 / 30;
let now = performance.now();

function render(delta) {
    delta = delta - now;
    now = performance.now();
    console.log(delta);
    let move = player.render();
    //app.stage.x = app.stage.x * (Math.pow(0.95, delta)) + (-player.graphics.x + 350) * (1 - (Math.pow(0.95, delta)));
    app.stage.y = app.stage.y * (Math.pow(0.95, delta)) + (-player.graphics.y + 250) * (1 - (Math.pow(0.95, delta)));
    //app.stage.x -= move.moveX;
    //app.stage.y -= move.moveY;

    for (let i = 0; i < players.length; i++) {
        players[i].render();
    }
    window.requestAnimationFrame(render);
}
window.requestAnimationFrame(render);