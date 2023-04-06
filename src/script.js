const SPRITE_SIZE = 16;
const OFF_BUTTON = 0;
const ON_BUTTON = 1;
const TILE = 2;

const NUMBER_OF_ATTEMPTS = 100;
const MOVER_PER_ATTEMPT = 10;

let scaleFactor = 1;

const canvasBg = document.getElementById('canvas-bg');
const contextBg = canvasBg.getContext('2d');
contextBg.imageSmoothingEnabled = false;

const canvasFg = document.getElementById('canvas-fg');
const contextFg = canvasFg.getContext('2d');
contextFg.imageSmoothingEnabled = false;

const sprites = new Image();
sprites.src = 'spritesheet.png';

let gameBoard = [
    [0, 0, 0],
    [1, 0, 0],
    [1, 0, 0],
];

let boardSize = gameBoard.length;

function copyBoard() {
    let newBoard = [];

    for(let x = 0; x < boardSize; x++) {
        newBoard[x] = [];

        for(let y = 0; y < boardSize; y++) {
            newBoard[x][y] = gameBoard[x][y];
        }
    }

    return newBoard;
}

function isSolved(board) {
    for(let x = 0; x < boardSize; x++) {
        for(let y = 0; y < boardSize; y++) {
            if(board[y][x] !== 1) {
                return false;
            }
        }
    }

    return true;
}

function toggleCellAndNeighbors(board, x, y) {
    // toggle cell
    board[y][x] = board[y][x] === 0 ? 1 : 0;

    // toggle above
    if(y > 0) {
        board[y - 1][x] = board[y - 1][x] === 0 ? 1 : 0;
    }

    // toggle below
    if(y < boardSize - 1) {
        board[y + 1][x] = board[y + 1][x] === 0 ? 1 : 0;
    }

    // toggle left
    if(x > 0) {
        board[y][x - 1] = board[y][x - 1] === 0 ? 1 : 0;
    }

    // toggle right
    if(x < boardSize - 1) {
        board[y][x + 1] = board[y][x + 1] === 0 ? 1 : 0;
    }
}

function solve() {
    let bestNumberOfMoves = Infinity;
    let bestMoves = [];

    for(let i = 0; i < NUMBER_OF_ATTEMPTS; i++) {
        console.debug('Attempt #' + i);

        let tempBoard = copyBoard();
        let moves = [];

        for(let j = 0; j < MOVER_PER_ATTEMPT; j++) {
            let x = Math.floor(Math.random() * boardSize);
            let y = Math.floor(Math.random() * boardSize);
            moves.push(
                {
                    x: (x + 1),
                    y: (y + 1)}
                );
            toggleCellAndNeighbors(tempBoard, x, y);

            if(isSolved(tempBoard)) {
                console.debug('Solution found in ' + (j + 1) + ' moves');
                if(j < bestNumberOfMoves) {
                    bestNumberOfMoves = j;
                    bestMoves = moves;
                }
                break;
            }
        }
    }

    console.debug('---------------------------------------------');

    if(bestNumberOfMoves === Infinity) {
        console.debug('No solution found');
    } else {
        console.debug('Best solution found in ' + (bestNumberOfMoves + 1) + ' moves');
        console.debug(bestMoves);
    }
}

function drawBackground() {
    canvasBg.width = window.innerWidth;
    canvasBg.height = window.innerHeight;

    let scaledSize = SPRITE_SIZE * scaleFactor;

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
    let scaledSize = SPRITE_SIZE * scaleFactor;
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
    let scaledSize = SPRITE_SIZE * scaleFactor;
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

    scaleFactor = Math.min(widthFactor, heightFactor);
}

function draw() {
    setScaleFactor();
    drawBackground();
    drawGameBoard();
}

draw();
