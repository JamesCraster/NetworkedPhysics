/*var express = require("express");
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
    constructor() {
        super(0, 0, 50, 50);
        this.vx = 0;
        this.vy = 0;
        this.grounded = false;
    }
}

function hitTestRectangle(a, b) {
    return (a.position.x < b.position.x + b.width && a.position.x + a.width > b.position.x &&
        a.position.y < b.position.y + b.height && a.position.y + a.height > b.position.y);
}

io.on("connection", function (socket) {
    let directions = [Inputs.NONE, Inputs.NONE];
    let player = new Player();
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

        if (player.position.y + player.vy > 550) {
            player.position.y = 550;
            player.vy = 0;
            player.grounded = true;
        }
        if (player.position.x + player.vx < 0) {
            player.position.x = 0;
            player.vx = 0;
        }
        if (player.position.x + player.vx > 750) {
            player.position.x = 750;
            player.vx = 0;
        }
        /*for (let i = 0; i < boxes.length; i++) {
            //top edge
            if (player.vy > 0) {
                if (hitTestRectangle(player.project(0, player.vy), boxes[i])) {
                    player.position.y = boxes[i].position.y - 50;
                    if (player.vy > 0) {
                        player.vy = 0;
                        player.grounded = true;
                    }
                }
            }
            //bottom edge
            if (player.vy < 0) {
                if (hitTestRectangle(player.project(0, player.vy), boxes[i])) {
                    player.position.y = boxes[i].position.y + 50;
                    if (player.vy < 0) {
                        player.vy = 0;
                    }
                }
            }
            //left edge
            if (player.vx > 0) {
                if (hitTestRectangle(player.project(player.vx, 0), boxes[i])) {
                    player.position.x = boxes[i].position.x - 50;
                    player.vx = 0;
                }
            }
            //right edge
            if (player.vx < 0) {
                if (hitTestRectangle(player.project(player.vx, 0), boxes[i])) {
                    player.position.x = boxes[i].position.x + 50;
                    player.vx = 0;
                }
            }
        }

player.position.x += player.vx;
player.position.y += player.vy;
socket.emit('update', player.position);
}
setInterval(update, 100);
});

var port = 8081;
http.listen(port, function () {
    console.log('Port is:' + port);
});*/

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
            player.vx -= 4;
        } else if (directions[0] == Inputs.RIGHT) {
            player.vx += 4;
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
        position.x += player.vx;
        position.y += player.vy;
        socket.emit('update', position);
    }
    setInterval(update, 100);
});

function update() {

}

var port = 8081;
http.listen(port, function () {
    console.log('Port is:' + port);
});