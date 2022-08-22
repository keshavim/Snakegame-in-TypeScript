


//utility fuctions
let tileSize = 10;
let paused = false;
function randInt(min:number, max:number){
    return Math.floor(Math.random() *(max - min) + min);
}

let interval : number;



let player:GameObject[] = [];
let apple:GameObject;

function main(){
    gi.init();
    for (let i = 0; i < 3; i++) {
        player[i] = new GameObject("green");
        if(i > 0){
            player[i].setPos(player[i-1].x, player[i-1].y + tileSize);
        }
        
    }
    dx = player[0].x > gi.canvas.width/2 ? -1 : 1;
    apple = new GameObject("red");
    interval = window.setInterval(Update, 16);
}
function pause() {paused = !paused;}


function Update() {
    if(paused) return;
    gi.clear();
    gi.drawGrid();
    
    apple.draw();
    UpdatePlayer();
    CheckCollision();
        
    
}


//objects and aliases
//defins elements of the game istance, doesn't need to be a complete class
type GameInstance = {
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D | null;
    init: () => void;
    drawGrid: () => void;
    clear: () => void;
};

let gi: GameInstance = {
    canvas: <HTMLCanvasElement>document.getElementById("GameCanvas"),
    context: null,
    init: () => {
        gi.context = gi.canvas.getContext("2d");
        document.body.insertBefore(gi.canvas, document.body.childNodes[0]);
        document.addEventListener("keydown", KeydownInput);
        document.addEventListener("keyup", KeyupInput);
        tileSize = parseInt((<HTMLInputElement>document.getElementById("TileSize")).value);
        isDead = false;
        paused = false;
        canMove = true;
        player = [];
        score = 0;
        let s = document.getElementById("score");
        if(s !== null) s.innerText = "Score: " + score;

        window.clearInterval(interval);
        
    },
    drawGrid: () => {
        //checks if grid should be drawn.
        if (!(<HTMLInputElement>document.getElementById("ShowGrid")).checked) return;

        let ctx = gi.context;
        ctx?.beginPath();
        for (let i = 0; i < gi.canvas.width; i += tileSize) {
            ctx?.moveTo(i, 0);
            ctx?.lineTo(i, gi.canvas.height);
        }
        for (let i = 0; i < gi.canvas.height; i += tileSize) {
            ctx?.moveTo(0, i);
            ctx?.lineTo(gi.canvas.width, i);
        }
        if (ctx !== null) ctx.strokeStyle = "white";
        ctx?.stroke();
    },
    clear: () => {
        gi.context?.clearRect(0, 0, gi.canvas.width, gi.canvas.height);
    },
};

//class that make a normal gameobject
class GameObject {
    x:number = 0;
    y:number = 0;
    width:number = 0;
    height:number = 0;
    color: string = "";

    constructor(color:string) {
        this.setPos(randInt(0, gi.canvas.width/tileSize) *tileSize, randInt(0, gi.canvas.height/tileSize)*tileSize);
        this.width = tileSize;
        this.height = tileSize;
        this.color = color;
    }
    setPos(x:number, y:number){
        this.x = x;
        this.y = y;
    }
    move(x:number, y:number){
        this.x += x;
        this.y += y;
    }
    draw(){
        gi.context?.beginPath();
        if(gi.context !== null)gi.context.fillStyle = this.color;
        gi.context?.fillRect(this.x, this.y, this.width, this.height);
    }
}


let canMove:boolean = true;
let isDead : boolean = false;
let snakeColor : string;
let timer: NodeJS.Timeout;
let dx:number = 1;
let dy:number = 0;
let baseSpeed = 4
let speed = baseSpeed;
let score = 0;

function UpdatePlayer(){
    
    let lastpos:number[] =[player[0].x, player[0].y];
    for(let i = 0; i < player.length; i++){
        if(canMove && !isDead){
            if(i == 0){
                player[i].move(dx * tileSize, dy * tileSize);
            }else{
                let temp = [player[i].x, player[i].y];
                player[i].setPos(lastpos[0], lastpos[1]);
                lastpos = temp;
            }
            if((<HTMLInputElement>document.getElementById("Rainbow")).checked)
                player[i].color = `rgb(${randInt(20, 255)}, ${randInt(20, 255)}, ${randInt(20, 255)})`;
        }

        player[i].draw();
        
    }
    if(canMove){
        canMove=false;
        timer = setTimeout(()=>{canMove = true}, 400/speed);
    }
    
    
}
function CheckCollision(){

    if(player[0].x == apple.x && player[0].y == apple.y){
        apple.setPos(randInt(0, gi.canvas.width/tileSize) *tileSize, randInt(0, gi.canvas.height/tileSize)*tileSize);
        player.push(new GameObject("green"));
        score++;
        let s = document.getElementById("score");
        if(s !== null) s.innerText = "Score: " + score;
    }
    else if(player[0].x < 0 || player[0].x > gi.canvas.width-tileSize || player[0].y < 0 || player[0].y > gi.canvas.height - tileSize){
        isDead = true;
        clearTimeout(timer);
        if(gi.context !== null){
            gi.context.font = "40px Arial";
            gi.context.fillStyle = "red";
        }
        gi.context?.fillText("  Game Over", gi.canvas.width/3 - tileSize * 2, gi.canvas.height/2 - tileSize*2);
        gi.context?.fillText("Don't Hit Walls", gi.canvas.width/3 - tileSize * 2, gi.canvas.height/2+tileSize *2);
        document.removeEventListener("keydown", KeydownInput);
        document.removeEventListener("keyup", KeyupInput);
    }
    for (let i = 1; i < player.length; i++) {
        if(player[0].x == player[i].x && player[0].y == player[i].y){
            isDead = true;
            clearTimeout(timer);
            if(gi.context !== null){
                gi.context.font = "40px Arial";
                gi.context.fillStyle = "red";
            }
            gi.context?.fillText("  Game Over", gi.canvas.width/3 - tileSize * 2, gi.canvas.height/2 - tileSize*2);
            gi.context?.fillText("Don't Hit YourSelf", gi.canvas.width/3 - tileSize * 2, gi.canvas.height/2+tileSize *2);
            document.removeEventListener("keydown", KeydownInput);
            document.removeEventListener("keyup", KeyupInput);
        }
        
    }
}

function KeydownInput(event: KeyboardEvent){
    switch(event.code){
        case "ArrowUp":
            if(dx != 0){dx = 0; dy = -1;}
            break;
        case "ArrowDown":
            if(dx != 0){ dx = 0; dy = 1;}
            break;
        case "ArrowLeft":
            if(dy != 0){dx = -1; dy = 0;}
            break;
        case "ArrowRight":
            if(dy != 0){ dx = 1; dy = 0;}
            break;
        case "Space":
            speed = baseSpeed * 2 / (tileSize/10);
            break;
    }
}
function KeyupInput(event: KeyboardEvent){
    if(event.code == "Space"){
        speed = baseSpeed / (tileSize/10);
    }
}

