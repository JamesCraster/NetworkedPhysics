/*"use strict"
var socket = io();
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
        this.graphics.x = this._x * alpha + this._previousX * (1 - alpha);
        this.graphics.y = this._y * alpha + this._previousY * (1 - alpha);
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

socket.on('update', function (position) {
    player._setPosition(position.x, position.y);
});
socket.on('platforms', function (boxes) {
    console.log(boxes);
    for (let i = 0; i < boxes.length; i++) {
        new Box(boxes[i].position.x, boxes[i].position.y);
    }
});
var delta = 0;
var lastFrameTime = 0;
var step = 1000 / 30;

//function update() {
//if (player.xInput == Inputs.RIGHT) {
//player.vx = 10;
//  socket.emit('input', Inputs.RIGHT);
//} else if (player.xInput == Inputs.LEFT) {
//player.vx = -10;
//}
//player.setXInput(Inputs.NONE);
//socket.emit('input', player.xInput);
//socket.emit('input', player.yInput);
/*if (player.yInput == Inputs.DOWN) {
    //player.move(0, 10);
} else if (player.yInput == Inputs.UP) {
    if (this._canJump) {
        player.vy -= 100;
        this._canJump = false;
    }
}
player.vy += 10;
if (player.y + player.vy > 550) {
    player.y = 550;
    player.vy = 0;
    this._canJump = true;
}
if (player.x + player.vx < 0) {
    player.x = 0;
    player.vx = 0;
}
if (player.x + player.vx > 750) {
    player.x = 750;
    player.vx = 0;
}
player.move(player.vx, player.vy);
if (player.vy > 30) {
    player.vy = 30;
}
player.setYInput(Inputs.NONE);
//}

//setInterval(update, 1000 / 30);
function render() {
    player.render();
    window.requestAnimationFrame(render);
}
window.requestAnimationFrame(render);*/
"use strict"
var socket = io('http://openwerewolf.us-west-2.elasticbeanstalk.com:8081');
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
const serverInterval = 100;
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
        this.graphics.x = this._x * alpha + this._previousX * (1 - alpha);
        this.graphics.y = this._y * alpha + this._previousY * (1 - alpha);
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

socket.on('update', function (position) {
    player._setPosition(position.x, position.y);
});
var delta = 0;
var lastFrameTime = 0;
var step = 1000 / 30;

//function update() {
//if (player.xInput == Inputs.RIGHT) {
//player.vx = 10;
//  socket.emit('input', Inputs.RIGHT);
//} else if (player.xInput == Inputs.LEFT) {
//player.vx = -10;
//}
//player.setXInput(Inputs.NONE);
//socket.emit('input', player.xInput);
//socket.emit('input', player.yInput);
/*if (player.yInput == Inputs.DOWN) {
    //player.move(0, 10);
} else if (player.yInput == Inputs.UP) {
    if (this._canJump) {
        player.vy -= 100;
        this._canJump = false;
    }
}
player.vy += 10;
if (player.y + player.vy > 550) {
    player.y = 550;
    player.vy = 0;
    this._canJump = true;
}
if (player.x + player.vx < 0) {
    player.x = 0;
    player.vx = 0;
}
if (player.x + player.vx > 750) {
    player.x = 750;
    player.vx = 0;
}
player.move(player.vx, player.vy);
if (player.vy > 30) {
    player.vy = 30;
}
player.setYInput(Inputs.NONE);*/
//}

//setInterval(update, 1000 / 30);
function render() {
    player.render();
    window.requestAnimationFrame(render);
}
window.requestAnimationFrame(render);