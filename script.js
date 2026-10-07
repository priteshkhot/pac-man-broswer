let board;
const rowCount = 21;
const columnCount = 19;
const tileSize = 32;
const boardWidth = columnCount*tileSize;
const boardHeight = rowCount*tileSize;
let context;

let redGhost;
let orangeGhost;
let pinkGhost;
let blueGhost;
let pacmanUpImage;
let pacmanDownImage;
let pacmanLeftImage;
let pacmanRightImage;
let wallImage;

const tileMap = [
    "XXXXXXXXXXXXXXXXXXX",
    "X        X        X",
    "X XX XXX X XXX XX X",
    "X                 X",
    "X XX X XXXXX X XX X",
    "X    X       X    X",
    "XXXX XXXX XXXX XXXX",
    "OOOX X       X XOOO",
    "XXXX X XXrXX X XXXX",
    "O       bpo       O",
    "XXXX X XXXXX X XXXX",
    "OOOX X       X XOOO",
    "XXXX X XXXXX X XXXX",
    "X        X        X",
    "X XX XXX X XXX XX X",
    "X  X     P     X  X",
    "XX X X XXXXX X X XX",
    "X    X   X   X    X",
    "X XXXXXX X XXXXXX X",
    "X                 X",
    "XXXXXXXXXXXXXXXXXXX" 
];

const walls = new Set();
const foods = new Set();
const ghosts = new Set();
let pacman;

const directions = ['U', 'D', 'L', 'R']; //up down left right
let score = 0;
let lives = 3;
let gameOver = false;

window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d"); //used for drawing on the board
    loadImages();
    loadMap();
    update();
    document.addEventListener("keydown", pacmanMove);
}

function loadImages() {
    wallImage = new Image();
    wallImage.src = "source/wall.png";

    blueGhostImage = new Image();
    blueGhostImage.src = "source/blueGhost.png";
    orangeGhostImage = new Image();
    orangeGhostImage.src = "source/orangeGhost.png"
    pinkGhostImage = new Image()
    pinkGhostImage.src = "source/pinkGhost.png";
    redGhostImage = new Image()
    redGhostImage.src = "source/redGhost.png";

    pacmanUpImage = new Image();
    pacmanUpImage.src = "source/pacmanUp.png";
    pacmanDownImage = new Image();
    pacmanDownImage.src = "source/pacmanDown.png";
    pacmanLeftImage = new Image();
    pacmanLeftImage.src = "source/pacmanLeft.png";
    pacmanRightImage = new Image();
    pacmanRightImage.src = "source/pacmanRight.png";
}

function loadMap() {
    walls.clear();
    foods.clear();
    ghosts.clear();

    for (let r=0; r<rowCount; r++){
        for (let c=0; c<columnCount; c++){
            const row = tileMap[r];
            const tileMapChar = row[c];

            const x = c*tileSize;
            const y = r*tileSize;

            if (tileMapChar == 'X') { //block wall
                const wall = new Block(wallImage, x, y, tileSize, tileSize);
                walls.add(wall);  
            }
            if (tileMapChar == 'r') { 
                const ghost = new Block(redGhostImage, x, y, tileSize, tileSize);
                ghosts.add(ghost);  
            }
            if (tileMapChar == 'b') { 
                const ghost = new Block(blueGhostImage, x, y, tileSize, tileSize);
                ghosts.add(ghost);  
            }
            if (tileMapChar == 'p') { 
                const ghost = new Block(pinkGhostImage, x, y, tileSize, tileSize);
                ghosts.add(ghost);  
            }
            if (tileMapChar == 'o') { 
                const ghost = new Block(orangeGhostImage, x, y, tileSize, tileSize);
                ghosts.add(ghost);  
            }
            else if (tileMapChar == 'P') { //pacman
                pacman = new Block(pacmanRightImage, x, y, tileSize, tileSize);
            }
            else if (tileMapChar == ' ') { //empty is food
                const food = new Block(null, x + 14, y + 14, 4, 4);
                foods.add(food);
            }
        }
    }
}

function update() {
    move();
    draw();
    setTimeout(update, 50);
    // Since you are recursively calling draw(drawImage), you do not have to check if the images have loaded
}

function draw() {
context.clearRect(0, 0, board.width, board.height);
    context.drawImage(pacman.image, pacman.x, pacman.y, pacman.width, pacman.height);
    for (let ghost of ghosts.values()) {
        context.drawImage(ghost.image, ghost.x, ghost.y, ghost.width, ghost.height);
    }
    
    for (let wall of walls.values()) {
        context.drawImage(wall.image, wall.x, wall.y, wall.width, wall.height);
    }

    context.fillStyle = "white";
    for (let food of foods.values()) {
        context.fillRect(food.x, food.y, food.width, food.height);
    }
}

function move() {
    if (canMove(pacman, pacman.nextDirection) && pacman.nextDirection != '') {
        let tempDirection = pacman.nextDirection;
        pacman.nextDirection = '';
        pacman.updateDirection(tempDirection);
         //update pacman images
        if (pacman.direction == 'U') {
            pacman.image = pacmanUpImage;
        }
        else if (pacman.direction == 'D') {
            pacman.image = pacmanDownImage;
        }
        else if (pacman.direction == 'L') {
            pacman.image = pacmanLeftImage;
        }
        else if (pacman.direction == 'R') {
            pacman.image = pacmanRightImage;
        }
    }
    pacman.x += pacman.velocityX;
    pacman.y += pacman.velocityY;

    //check wall collisions
    for (let wall of walls.values()) {
        if (collision(pacman, wall)) {
            // COLLISION wrong logic, pacman needs to be moving that way to check proper collision os something
            // if (pacman.nextDirection != '') {
            //     let tempDirection = pacman.nextDirection;
            //     pacman.nextDirection = '';
            //     pacman.updateDirection(tempDirection);
            // } else {
            pacman.x -= pacman.velocityX;
            pacman.y -= pacman.velocityY;
            break;
            // }
            
        }
    }
}

// function that checks input buffering/queued movement.
function canMove(block, direction) {
    let testX = block.x;
    let testY = block.y;

    if (direction == "U") {
        testY -= tileSize;
    }
    else if (direction == "D") {
        testY += tileSize;
    }
    else if (direction == "L") {
        testX -= tileSize;
    }
    else if (direction == "R") {
        testX += tileSize;
    }

    let testBlock = {
        x: testX,
        y: testY,
        width: block.width,
        height: block.height
    };

    for (let wall of walls) {
        if (collision(testBlock, wall)) {
            return false;
        }
    }

    return true;
}

function pacmanMove(e) {
    if (gameOver) {
        loadMap();
        resetPositions();
        lives = 3;
        score = 0;
        gameOver = false;
        update(); //restart game loop
        return;
    }

    if (e.code == "ArrowUp" || e.code == "KeyW") {
        pacman.nextDirection = "U";
    }
    else if (e.code == "ArrowDown" || e.code == "KeyS") {
        pacman.nextDirection = "D";
    }
    else if (e.code == "ArrowLeft" || e.code == "KeyA") {
        pacman.nextDirection = "L";
    }
    else if (e.code == "ArrowRight" || e.code == "KeyD") {
        pacman.nextDirection = "R";
    }
    
}

function collision(a, b) {
    return a.x < b.x + b.width &&   //a's top left corner doesn't reach b's top right corner
           a.x + a.width > b.x &&   //a's top right corner passes b's top left corner
           a.y < b.y + b.height &&  //a's top left corner doesn't reach b's bottom left corner
           a.y + a.height > b.y;    //a's bottom left corner passes b's top left corner
}

class Block {
    constructor(image, x, y, width, height) {
        this.image = image;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.startX = x;
        this.startY = y;

        this.direction = 'R';
        this.velocityX = 0;
        this.velocityY = 0;
        this.nextDirection = '';
    }

    updateDirection(direction) {
        const prevDirection = this.direction;
        this.direction = direction;
        this.updateVelocity();
        this.x += this.velocityX;
        this.y += this.velocityY;
        
        for (let wall of walls.values()) {
            if (collision(this, wall)) {
                this.x -= this.velocityX;
                this.y -= this.velocityY;
                this.nextDirection = this.direction;
                this.direction = prevDirection;
                this.updateVelocity();
                return;
            }
        }
    }

    updateVelocity() {
        if (this.direction == 'U') {
            this.velocityX = 0;
            this.velocityY = -tileSize/4;
        }
        else if (this.direction == 'D') {
            this.velocityX = 0;
            this.velocityY = tileSize/4;
        }
        else if (this.direction == 'L') {
            this.velocityX = -tileSize/4;
            this.velocityY = 0;
        }
        else if (this.direction == 'R') {
            this.velocityX = tileSize/4;
            this.velocityY = 0;
        }
    }

    reset() {
        this.x = this.startX;
        this.y = this.startY;
    }
};
