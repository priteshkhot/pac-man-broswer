let board;
let rowCount = 10;
let colCount = 10;
let tileSize = 32;
let boardHeight = colCount*tileSize;
let boardWidth = rowCount*tileSize;
let context;

let pacman;

window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d"); //used for drawing on the board
    loadImage();
    context.drawImage(pacman, 0, 0);
}

function loadImage() {
    pacman = new Image();
    pacman.src = "./pacmanRight.png" 
}

