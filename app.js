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
class Box {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 50;
    }
}
const boxes = [new Box(500, 500), new Box(300, 550), new Box(200, 200), new Box(200, 300)];

class Player {
    constructor() {
        this.vx = 0;
        this.vy = 0;
    }
}
io.on("connection", function (socket) {
    let directions = [Inputs.NONE, Inputs.NONE];
    let player = {
        vx: 0,
        vy: 0,
        grounded: false
    };
    let position = {
        x: 0,
        y: 0
    };
    socket.emit('platforms', boxes);
    socket.on('input', function (direction) {
        if (direction == Inputs.LEFT || direction == Inputs.RIGHT) {
            directions[0] = direction;
        }
        if (direction == Inputs.UP || direction == Inputs.DOWN) {
            directions[1] = direction;
        }
    });

    function update() {
        if (directions[0] == Inputs.LEFT) {
            player.vx -= 6;
        } else if (directions[0] == Inputs.RIGHT) {
            player.vx += 6;
        }
        if (directions[1] == Inputs.UP) {
            if (player.grounded == true) {
                player.vy -= 50;
                player.grounded = false;
            }
            directions[1] = Inputs.NONE;
        }
        player.vy += 5;

        if (player.vx > 20) {
            player.vx = 20;
        }
        if (player.vx < -20) {
            player.vx = -20;
        }
        if (player.vy > 30) {
            player.vy = 30;
        }

        if (position.y + player.vy > 550) {
            position.y = 550;
            player.vy = 0;
            player.grounded = true;
        }
        if (position.x + player.vx < 0) {
            position.x = 0;
            player.vx = 0;
        }
        if (position.x + player.vx > 750) {
            position.x = 750;
            player.vx = 0;
        }
        for (let i = 0; i < boxes.length; i++) {
            //top edge
            if (player.vy > 0) {
                if (position.y + player.vy + 50 > boxes[i].y && position.y + player.vy < boxes[i].y + 50 && position.x + 50 > boxes[i].x && position.x < boxes[i].x + boxes[i].width) {
                    position.y = boxes[i].y - 50;
                    if (player.vy > 0) {
                        player.vy = 0;
                        player.grounded = true;
                    }
                }
            }
            //bottom edge
            if (player.vy < 0) {
                if (position.y + player.vy + 50 > boxes[i].y && position.y + player.vy < boxes[i].y + 50 && position.x + 50 > boxes[i].x && position.x < boxes[i].x + boxes[i].width) {
                    position.y = boxes[i].y + 50;
                    if (player.vy < 0) {
                        player.vy = 0;
                    }
                }
            }
            //left edge
            if (player.vx > 0) {
                if (position.x + player.vx + 50 > boxes[i].x && position.x + player.vx < boxes[i].x + boxes[i].width && position.x < boxes[i].x && position.y + player.vy >= boxes[i].y && position.y + player.vy <= boxes[i].y + boxes[i].height) {
                    position.x = boxes[i].x - 50;
                    player.vx = 0;
                }
            }
            //right edge
            if (player.vx < 0) {
                if (position.x + player.vx < boxes[i].x + 50 && position.x + player.vx + 50 > boxes[i].x + boxes[i].width && position.y + player.vy >= boxes[i].y && position.y + player.vy <= boxes[i].y + boxes[i].height) {
                    position.x = boxes[i].x + 50;
                    player.vx = 0;
                }
            }
        }
        position.x += player.vx;
        position.y += player.vy;
        socket.emit('update', position);
    }
    setInterval(update, 100);
});

var port = 8081;
http.listen(port, function () {
    console.log('Port is:' + port);
});