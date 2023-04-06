const SPRITE_SIZE = 16;
const OFF_BUTTON = 0;
const ON_BUTTON = 1;
const TILE = 2;

let SCALE_FACTOR = 1;

const canvasBg = document.getElementById('canvas-bg');
const contextBg = canvasBg.getContext('2d');

const canvasFg = document.getElementById('canvas-fg');
const contextFg = canvasFg.getContext('2d');

const sprites = document.getElementById('sprite-sheet');

let gameBoard = [
    [0, 0, 0],
    [1, 0, 0],
    [1, 0, 0],
];

let boardSize = gameBoard.length;

function drawBackground() {
    canvasBg.width = window.innerWidth;
    canvasBg.height = window.innerHeight;

    let scaledSize = SPRITE_SIZE * SCALE_FACTOR;

    let columns = window.innerWidth / scaledSize;
    let rows = window.innerHeight / scaledSize;

    let sourceX = SPRITE_SIZE * TILE;

    for (let x = 0; x < columns; x++) {
        for (let y = 0; y < rows; y++) {
            contextBg.drawImage(
                sprites, // image
                sourceX, 0, // sourceX, sourceY
                SPRITE_SIZE, SPRITE_SIZE, // sourceWidth, sourceHeight
                x * scaledSize, y * scaledSize, // destinationX, destinationY
                scaledSize, scaledSize // destinationWidth, destinationHeight
            );
        }
    }
}

function drawGameBoard() {
    let scaledSize = SPRITE_SIZE * SCALE_FACTOR;
    let padding = scaledSize;
    let totalPadding = (boardSize - 1) * padding;
    let canvasSize = scaledSize * boardSize + totalPadding;
    canvasFg.width = canvasSize;
    canvasFg.height = canvasSize;

    for(let x = 0; x < boardSize; x++) {
        for(let y = 0; y < boardSize; y++) {

            let sourceX;

            if(gameBoard[y][x] === 0) {
                sourceX = SPRITE_SIZE * OFF_BUTTON;
            } else {
                sourceX = SPRITE_SIZE * ON_BUTTON;
            }

            contextFg.drawImage(
                sprites, // image
                sourceX, 0, // sourceX, sourceY
                SPRITE_SIZE, SPRITE_SIZE, // sourceWidth, sourceHeight
                x * scaledSize + x * padding, y * scaledSize + y * padding, // destinationX, destinationY
                scaledSize, scaledSize // destinationWidth, destinationHeight
            );
        }
    }
}

canvasFg.addEventListener('click', function(event) {
    let scaledSize = SPRITE_SIZE * SCALE_FACTOR;
    let padding = scaledSize;

    let mouseX = event.offsetX;
    let mouseY = event.offsetY;

    for(let x = 0; x < boardSize; x++) {
        for(let y = 0; y < boardSize; y++) {
            let x1 = x * scaledSize + x * padding;
            let x2 = x1 + scaledSize;
            let y1 = y * scaledSize + y * padding;
            let y2 = y1 + scaledSize;

            if(mouseX >= x1 && mouseX <= x2 && mouseY >= y1 && mouseY <= y2) {
                gameBoard[y][x] = gameBoard[y][x] === 0 ? 1 : 0;
            }
        }
    }

    draw();
});

window.addEventListener('resize', draw);

function setScaleFactor() {
    let minimumTileSize = SPRITE_SIZE;
    let minimumPadding = minimumTileSize;
    let totalPadding = (boardSize - 1) * minimumPadding;
    let minimumCanvasSize = minimumTileSize * boardSize + totalPadding;

    let widthFactor = Math.floor(window.innerWidth / minimumCanvasSize);
    let heightFactor = Math.floor(window.innerHeight / minimumCanvasSize);

    SCALE_FACTOR = Math.min(widthFactor, heightFactor);
}

function draw() {
    setScaleFactor();
    drawBackground();
    drawGameBoard();
}

draw();
