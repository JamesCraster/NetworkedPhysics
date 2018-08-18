var express = require("express");
var app = express();
var http = require('http').Server(app);
var io = require("socket.io")(http);

app.use(express.static('public'));

var Inputs = {
    LEFT: 'LEFT',
    RIGHT: 'RIGHT',
    DOWN: 'DOWN',
    UP: 'UP',
    NONE: 'NONE'
}
class Rectangle {
    constructor(x, y, width, height) {
        this.position = {
            x: x,
            y: y
        };
        this.height = height;
        this.width = width;
    }
    project(distX, distY) {
        return new Rectangle(this.position.x + distX, this.position.y + distY, this.width, this.height);
    }
}
class Box extends Rectangle {
    constructor(x, y) {
        super(x, y, 50, 50);
    }
}
const boxes = [new Box(500, 500), new Box(300, 550), new Box(200, 200), new Box(200, 300)];

class Player extends Rectangle {
    constructor(socket) {
        super(0, 0, 50, 50);
        this.vx = 0;
        this.vy = 0;
        this.grounded = false;
        this.directions = [Inputs.NONE, Inputs.NONE];
        this.socket = socket;
    }

    update() {
        if (this.directions[0] == Inputs.LEFT) {
            this.vx -= 6;
        } else if (this.directions[0] == Inputs.RIGHT) {
            this.vx += 6;
        }
        if (this.directions[1] == Inputs.UP) {
            if (this.grounded == true) {
                this.vy -= 50;
                this.grounded = false;
            }
            this.directions[1] = Inputs.NONE;
        }
        this.vy += 5;

        if (this.vx > 20) {
            this.vx = 20;
        }
        if (this.vx < -20) {
            this.vx = -20;
        }
        if (this.vy > 30) {
            this.vy = 30;
        }

        if (this.position.y + this.vy > 550) {
            this.position.y = 550;
            this.vy = 0;
            this.grounded = true;
        }
        if (this.position.x + this.vx < 0) {
            this.position.x = 0;
            this.vx = 0;
        }
        if (this.position.x + this.vx > 750) {
            this.position.x = 750;
            this.vx = 0;
        }
        for (let i = 0; i < boxes.length; i++) {
            //top edge
            if (this.vy > 0) {
                if (hitTestRectangle(this.project(0, this.vy), boxes[i])) {
                    this.position.y = boxes[i].position.y - 50;
                    if (this.vy > 0) {
                        this.vy = 0;
                        this.grounded = true;
                    }
                }
            }
            //bottom edge
            if (this.vy < 0) {
                if (hitTestRectangle(this.project(0, this.vy), boxes[i])) {
                    this.position.y = boxes[i].position.y + 50;
                    if (this.vy < 0) {
                        this.vy = 0;
                    }
                }
            }
            //left edge
            if (this.vx > 0) {
                if (hitTestRectangle(this.project(this.vx, 0), boxes[i])) {
                    this.position.x = boxes[i].position.x - 50;
                    this.vx = 0;
                }
            }
            //right edge
            if (this.vx < 0) {
                if (hitTestRectangle(this.project(this.vx, 0), boxes[i])) {
                    this.position.x = boxes[i].position.x + 50;
                    this.vx = 0;
                }
            }
        }

        this.position.x += this.vx;
        this.position.y += this.vy;
        this.socket.emit('update', this.position);
    }
}

function hitTestRectangle(a, b) {
    return (a.position.x < b.position.x + b.width && a.position.x + a.width > b.position.x &&
        a.position.y < b.position.y + b.height && a.position.y + a.height > b.position.y);
}

let players = [];
io.on("connection", function (socket) {
    let player = new Player(socket);
    for (let i = 0; i < players.length; i++) {
        players[i].socket.emit('addPlayer', 0, 0);
    }
    for (let i = 0; i < players.length; i++) {
        socket.emit('addPlayer', 0, 0);
    }
    players.push(player);
    socket.emit('platforms', boxes);
    socket.on('input', function (direction) {
        if (direction == Inputs.LEFT || direction == Inputs.RIGHT) {
            player.directions[0] = direction;
        }
        if (direction == Inputs.UP || direction == Inputs.DOWN) {
            player.directions[1] = direction;
        }
    });
    socket.on('disconnect', function () {
        for (let i = 0; i < players.length; i++) {
            if (players[i].socket.id == socket.id) {
                for (let j = 0; j < players.length; j++) {
                    //need to fix
                    //players[j].socket.emit('removePlayer', i - 1);
                }
                players.splice(i, 1);
            }
        }
    });
});


function update() {
    for (let i = 0; i < players.length; i++) {
        players[i].update();
    }
    for (let i = 0; i < players.length; i++) {
        let temporaryArray = players.slice();
        temporaryArray.splice(i, 1);
        let parametersArray = [];
        for (let i = 0; i < temporaryArray.length; i++) {
            parametersArray.push(temporaryArray[i].position);
        }
        players[i].socket.emit('otherUpdate', parametersArray);
    }
}

setInterval(update, 100);

var port = 8081;
http.listen(port, function () {
    console.log('Port is:' + port);
});