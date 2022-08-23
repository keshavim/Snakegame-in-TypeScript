"use strict";
let tileSize = 10;
let paused = false;
function randInt(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}
let interval;
let player = [];
let apple;
function main() {
    gi.init();
    for (let i = 0; i < 3; i++) {
        player[i] = new GameObject("green");
        if (i > 0) {
            player[i].setPos(player[i - 1].x, player[i - 1].y + tileSize);
        }
    }
    dx = player[0].x > gi.canvas.width / 2 ? -1 : 1;
    dy = 0;
    apple = new GameObject("red");
    interval = window.setInterval(Update, 16);
}
function pause() { paused = !paused; }
function Update() {
    if (paused)
        return;
    gi.clear();
    gi.drawGrid();
    apple.draw();
    UpdatePlayer();
    CheckCollision();
}
let gi = {
    canvas: document.getElementById("GameCanvas"),
    context: null,
    init: () => {
        gi.context = gi.canvas.getContext("2d");
        document.body.insertBefore(gi.canvas, document.body.childNodes[0]);
        document.addEventListener("keydown", KeydownInput);
        document.addEventListener("keyup", KeyupInput);
        tileSize = parseInt(document.getElementById("TileSize").value);
        isDead = false;
        paused = false;
        canMove = true;
        player = [];
        score = 0;
        let s = document.getElementById("score");
        if (s !== null)
            s.innerText = "Score: " + score;
        window.clearInterval(interval);
    },
    drawGrid: () => {
        if (!document.getElementById("ShowGrid").checked)
            return;
        let ctx = gi.context;
        ctx === null || ctx === void 0 ? void 0 : ctx.beginPath();
        for (let i = 0; i < gi.canvas.width; i += tileSize) {
            ctx === null || ctx === void 0 ? void 0 : ctx.moveTo(i, 0);
            ctx === null || ctx === void 0 ? void 0 : ctx.lineTo(i, gi.canvas.height);
        }
        for (let i = 0; i < gi.canvas.height; i += tileSize) {
            ctx === null || ctx === void 0 ? void 0 : ctx.moveTo(0, i);
            ctx === null || ctx === void 0 ? void 0 : ctx.lineTo(gi.canvas.width, i);
        }
        if (ctx !== null)
            ctx.strokeStyle = "white";
        ctx === null || ctx === void 0 ? void 0 : ctx.stroke();
    },
    clear: () => {
        var _a;
        (_a = gi.context) === null || _a === void 0 ? void 0 : _a.clearRect(0, 0, gi.canvas.width, gi.canvas.height);
    },
};
class GameObject {
    constructor(color, x, y) {
        this.x = 0;
        this.y = 0;
        this.width = 0;
        this.height = 0;
        this.color = "";
        if (x == undefined)
            x = randInt(0, gi.canvas.width / tileSize);
        if (y == undefined)
            y = randInt(0, gi.canvas.height / tileSize);
        this.setPos(x * tileSize, y * tileSize);
        this.width = tileSize;
        this.height = tileSize;
        this.color = color;
    }
    setPos(x, y) {
        this.x = x;
        this.y = y;
    }
    move(x, y) {
        this.x += x;
        this.y += y;
    }
    draw() {
        var _a, _b;
        (_a = gi.context) === null || _a === void 0 ? void 0 : _a.beginPath();
        if (gi.context !== null)
            gi.context.fillStyle = this.color;
        (_b = gi.context) === null || _b === void 0 ? void 0 : _b.fillRect(this.x, this.y, this.width, this.height);
    }
}
let canMove = true;
let canTurn = true;
let isDead = false;
let snakeColor;
let timer;
let dx = 1;
let dy = 0;
let baseSpeed = 4;
let speed = baseSpeed;
let score = 0;
function UpdatePlayer() {
    let lastpos = [player[0].x, player[0].y];
    for (let i = 0; i < player.length; i++) {
        if (canMove && !isDead) {
            if (i == 0) {
                player[i].move(dx * tileSize, dy * tileSize);
            }
            else {
                let temp = [player[i].x, player[i].y];
                player[i].setPos(lastpos[0], lastpos[1]);
                lastpos = temp;
            }
            if (document.getElementById("Rainbow").checked)
                player[i].color = `rgb(${randInt(20, 255)}, ${randInt(20, 255)}, ${randInt(20, 255)})`;
        }
        player[i].draw();
    }
    if (canMove) {
        canMove = false;
        canTurn = true;
        timer = setTimeout(() => { canMove = true; }, 400 / speed);
    }
}
function CheckCollision() {
    var _a, _b, _c, _d;
    if (player[0].x == apple.x && player[0].y == apple.y) {
        apple.setPos(randInt(0, gi.canvas.width / tileSize) * tileSize, randInt(0, gi.canvas.height / tileSize) * tileSize);
        let temp = new GameObject("green", -1, -1);
        player.push(temp);
        score++;
        let s = document.getElementById("score");
        if (s !== null)
            s.innerText = "Score: " + score;
    }
    else if (player[0].x < 0 || player[0].x > gi.canvas.width - tileSize || player[0].y < 0 || player[0].y > gi.canvas.height - tileSize) {
        isDead = true;
        clearTimeout(timer);
        if (gi.context !== null) {
            gi.context.font = "40px Arial";
            gi.context.fillStyle = "red";
        }
        (_a = gi.context) === null || _a === void 0 ? void 0 : _a.fillText("  Game Over", gi.canvas.width / 3 - tileSize * 2, gi.canvas.height / 2 - tileSize * 2);
        (_b = gi.context) === null || _b === void 0 ? void 0 : _b.fillText("Don't Hit Walls", gi.canvas.width / 3 - tileSize * 2, gi.canvas.height / 2 + tileSize * 2);
        document.removeEventListener("keydown", KeydownInput);
        document.removeEventListener("keyup", KeyupInput);
    }
    for (let i = 1; i < player.length; i++) {
        if (player[0].x == player[i].x && player[0].y == player[i].y) {
            isDead = true;
            clearTimeout(timer);
            if (gi.context !== null) {
                gi.context.font = "40px Arial";
                gi.context.fillStyle = "red";
            }
            (_c = gi.context) === null || _c === void 0 ? void 0 : _c.fillText("  Game Over", gi.canvas.width / 3 - tileSize * 2, gi.canvas.height / 2 - tileSize * 2);
            (_d = gi.context) === null || _d === void 0 ? void 0 : _d.fillText("Don't Hit YourSelf", gi.canvas.width / 3 - tileSize * 2, gi.canvas.height / 2 + tileSize * 2);
            document.removeEventListener("keydown", KeydownInput);
            document.removeEventListener("keyup", KeyupInput);
        }
    }
}
function KeydownInput(event) {
    switch (event.code) {
        case "ArrowUp":
            if (dx != 0 && canTurn) {
                dx = 0;
                dy = -1;
                canTurn = false;
            }
            break;
        case "ArrowDown":
            if (dx != 0 && canTurn) {
                dx = 0;
                dy = 1;
                canTurn = false;
            }
            break;
        case "ArrowLeft":
            if (dy != 0 && canTurn) {
                dx = -1;
                dy = 0;
                canTurn = false;
            }
            break;
        case "ArrowRight":
            if (dy != 0 && canTurn) {
                dx = 1;
                dy = 0;
                canTurn = false;
            }
            break;
        case "Space":
            speed = baseSpeed * 2 / (tileSize / 10);
            break;
    }
}
function KeyupInput(event) {
    if (event.code == "Space") {
        speed = baseSpeed / (tileSize / 10);
    }
}
//# sourceMappingURL=main.js.map