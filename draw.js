import { GAME_CANVAS_STARTX, GAME_CANVAS_STARTY, 
        TETRIS_WIDTH, TETRIS_HEIGHT,
        BLOCK_SIZE,
        WAITING_CANVAS_STARTX, WAITING_CANVAS_STARTY,
        WAITING_CANVAS_WIDTH, WAITING_CANVAS_HEIGHT,
        SAVE_CANVAS_STARTX, SAVE_CANVAS_STARTY,
        SAVE_CANVAS_WIDTH, SAVE_CANVAS_HEIGHT,
        INFO_CANVAS_STARTX, INFO_CANVAS_STARTY,
        INFO_CANVAS_WIDTH, INFO_CANVAS_HEIGHT,
        ROUND_RADIUS,
        backgroundColor} from "./gameSettingParams.js";

import { isOutOfBounds } from "./judgeCalc.js";
import { getTetrisCoords } from "./judgeCalc.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

export function drawGameCanvas() {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(GAME_CANVAS_STARTX, GAME_CANVAS_STARTY, TETRIS_WIDTH*BLOCK_SIZE, TETRIS_HEIGHT*BLOCK_SIZE);
}

/**
 * 繪製Tetris內部的每個block
 */
export function drawBlock(x, y, color) {
    if (color == backgroundColor)
    {
        ctx.fillStyle = color;
        ctx.fillRect(x+1, y+1, BLOCK_SIZE, BLOCK_SIZE);
    }
    else
    {
        // fill
        ctx.fillStyle = color;
        ctx.fillRect(x, y, BLOCK_SIZE, BLOCK_SIZE);
        // stroke
        ctx.strokeStyle = "black";
        ctx.lineWidth = 1;
        ctx.strokeRect(x + 0.5, y + 0.5, BLOCK_SIZE, BLOCK_SIZE);
    }  
}

/**
 * 繪製目前的Tetris
 */
export function drawCurTetris(tetris){
    // console.log(getTetrisCoords(tetris));
    if(!isOutOfBounds(tetris))
    {
        getTetrisCoords(tetris).forEach(block => {
            let drawX = Math.floor(GAME_CANVAS_STARTX + block.x*BLOCK_SIZE);
            let drawY = Math.floor(GAME_CANVAS_STARTY + block.y*BLOCK_SIZE);
            drawBlock(drawX, drawY, tetris.color); 
        });
    }
}

/**
 * 繪製gameMap
 */
export function drawMap(gameMap) {
    drawGameCanvas();
    for(let col = 0; col < TETRIS_WIDTH; col++)
    {
        for(let row = 0; row < TETRIS_HEIGHT; row++)
        {
            let thisColor = gameMap[col][row] ?? backgroundColor;
            // console.log("col: ", col, " row: ", row, " color: ", thisColor);
            let drawX = Math.floor(GAME_CANVAS_STARTX + col*BLOCK_SIZE);
            let drawY = Math.floor(GAME_CANVAS_STARTY + row*BLOCK_SIZE);
            drawBlock(drawX, drawY, thisColor);
        }
    }
}

// 等待區
export function drawWaitingAreaCanvas() {
    ctx.fillStyle = "white";
    ctx.fillRect(WAITING_CANVAS_STARTX, WAITING_CANVAS_STARTY, WAITING_CANVAS_WIDTH, WAITING_CANVAS_HEIGHT);
    ctx.strokeStyle = "black"; // 設定邊框顏色
    ctx.lineWidth = 1.5; // 設定邊框粗細

    ctx.beginPath();
    ctx.roundRect(WAITING_CANVAS_STARTX, WAITING_CANVAS_STARTY, WAITING_CANVAS_WIDTH, WAITING_CANVAS_HEIGHT, ROUND_RADIUS);
    ctx.stroke();
}

export function drawWatingTetris(allWaitingTetris) {
    drawWaitingAreaCanvas();
    // console.log(allWaitingTetris);

    allWaitingTetris.items.forEach((tetris, index) => {
        getTetrisCoords(tetris).forEach(block => {
            let drawX = Math.floor(WAITING_CANVAS_STARTX-47 + block.x*BLOCK_SIZE);
            let drawY = Math.floor(WAITING_CANVAS_STARTY + block.y*BLOCK_SIZE + (index+0.1)*100);
            drawBlock(drawX, drawY, tetris.color); 
        });
    });
}

// 保留區
export function drawSaveAreaCanvas() {
    ctx.fillStyle = "white";
    ctx.fillRect(SAVE_CANVAS_STARTX, SAVE_CANVAS_STARTY, SAVE_CANVAS_WIDTH, SAVE_CANVAS_HEIGHT);
    ctx.strokeStyle = "black"; // 設定邊框顏色
    ctx.lineWidth = 1.5; // 設定邊框粗細

    ctx.beginPath();
    ctx.roundRect(SAVE_CANVAS_STARTX, SAVE_CANVAS_STARTY, SAVE_CANVAS_WIDTH, SAVE_CANVAS_HEIGHT, ROUND_RADIUS);
    ctx.stroke();
}

export function drawSaveTetris(saveTetris) {
    // 若saveTetris非空物件才draw
    if(Object.keys(saveTetris).length !== 0)
    {
        drawSaveAreaCanvas();
        // console.log(saveTetris);
        getTetrisCoords(saveTetris).forEach(block => {
            let drawX = Math.floor(SAVE_CANVAS_STARTX-47 + block.x*BLOCK_SIZE);
            let drawY = Math.floor(SAVE_CANVAS_STARTY + block.y*BLOCK_SIZE + 15);
            drawBlock(drawX, drawY, saveTetris.color); 
        });
    }
}

// 影子
export function drawShadowBlock(x, y, color) {
    // stroke
    ctx.strokeStyle = "black";
    ctx.lineWidth = 1;
    ctx.strokeRect(x + 0.5, y + 0.5, BLOCK_SIZE, BLOCK_SIZE); 
}

export function drawCurShadow(tetris){
    // console.log(getTetrisCoords(tetris));
    if(!isOutOfBounds(tetris))
    {
        getTetrisCoords(tetris).forEach(block => {
            let drawX = Math.floor(GAME_CANVAS_STARTX + block.x*BLOCK_SIZE);
            let drawY = Math.floor(GAME_CANVAS_STARTY + block.y*BLOCK_SIZE);
            drawShadowBlock(drawX, drawY, tetris.color); 
        });
    }
}

// 計分板等資訊欄位
export function drawInfoAreaCanvas(score, gameLevel, lines) {
    ctx.fillStyle = "white";
    ctx.fillRect(INFO_CANVAS_STARTX, INFO_CANVAS_STARTY, INFO_CANVAS_WIDTH, INFO_CANVAS_HEIGHT);
    ctx.strokeStyle = "black"; // 設定邊框顏色
    ctx.lineWidth = 1.5; // 設定邊框粗細

    ctx.beginPath();
    ctx.roundRect(INFO_CANVAS_STARTX, INFO_CANVAS_STARTY, INFO_CANVAS_WIDTH, INFO_CANVAS_HEIGHT, ROUND_RADIUS);
    ctx.stroke();

    // 顯示資訊
    // 設定文字樣式
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // 計算文字顯示位置（置中）
    let textX = INFO_CANVAS_STARTX + INFO_CANVAS_WIDTH / 2;
    let textY = INFO_CANVAS_STARTY + 30; // 讓標題顯示在上方

    // 繪製標題
    ctx.fillText("Infomations", textX, textY);

    // 顯示score
    let scoreText = `Score: ${score}`;
    ctx.fillText(scoreText, textX, textY + 40);
    // 顯示gameLevel
    let gameLevelText = `GameLevel: ${gameLevel}`;
    ctx.fillText(gameLevelText, textX, textY + 65);
    // 顯示lines(已消除行)
    let linesText = `Lines: ${lines}`;
    ctx.fillText(linesText, textX, textY + 90);
}