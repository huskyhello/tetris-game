import { genRandomTetris } from "./tetrisSetting.js";
import { ROTATE_0, ROTATE_90, ROTATE_180, ROTATE_270 } from "./tetrisSetting.js";

import { isOutOfBounds } from "./judgeCalc.js";
import { hasReachedBottom } from "./judgeCalc.js";
import { hasReachedOtherBlocksBottom } from "./judgeCalc.js";
import { hasOverlappedOtherBlocks } from "./judgeCalc.js";
import { someBlocksReachTop} from "./judgeCalc.js";
import { getShadowTetris } from "./judgeCalc.js";

import { GAME_CANVAS_STARTX, GAME_CANVAS_STARTY, 
         TETRIS_WIDTH, TETRIS_HEIGHT,
         BLOCK_SIZE,
         backgroundColor} from "./gameSettingParams.js";

import { drawGameCanvas, drawBlock, drawCurTetris, drawMap, 
         drawWaitingAreaCanvas, drawWatingTetris, 
         drawSaveAreaCanvas, drawSaveTetris,
         drawInfoAreaCanvas,
         drawCurShadow, drawShadowBlock } from "./draw.js";

import { checkGameMapLines, updateGameMap, placeTetrisOnGameMap } from "./gameMapMaint.js";

import { Queue } from "./class/Queue.js"
import { MusicManager } from "./class/MusicManager.js";

// 音效
const fall = new MusicManager("./assets/sounds/fall.mp3");
const backgroundMusic = new MusicManager("./assets/sounds/New Jeans.mp3");
const save = new MusicManager("./assets/sounds/save.mp3")

let score = 0;
let lines = 0;
let gameLevel = 1;
let isPaused = false
let gameStart = false;
let firstKeyDown = true;
let nextTetris = new Queue();
const nextTetrisQuan = 3;
let currentTetris;
let shadowTetris;
let saveTetris = {}; // 初始化為空物件

// 用於記錄當前遊戲狀態的二維陣列map，其元素字串記錄當格color，初始為backgroundColor
let gameMap = Array.from({ length: TETRIS_WIDTH}, ()=>Array(TETRIS_HEIGHT).fill(backgroundColor));

/**
 * 遊戲結束
 */
function gameOver() {
    gameStart = false;
    // 先清空gameMap
    gameMap = Array.from({ length: TETRIS_WIDTH}, ()=>Array(TETRIS_HEIGHT).fill(backgroundColor));
    showGameOverPopup();
}

/**
 * 遊戲結束彈出視窗
 */
function showGameOverPopup() {
    Swal.fire({
        html: `
            <img src="./assets/images/endingAlert.gif" 
                 style="width: 100%; max-width: 300px; border-radius: 10px; margin-top: 10px" />
            <h2 style="margin-top: 15px; font-size: 24px;">Score: ${score}</h2>
        </div>
        `,
        confirmButtonText: 'Restart',
        allowOutsideClick: false, // 禁止點擊外部關閉
        allowEscapeKey: false, // 禁止按 ESC 鍵關閉
        allowEnterKey: false, // 禁止按 Enter 鍵關閉
        customClass: {
            confirmButton: 'swal-confirm-custom'
        }
    }).then((result) => {
        if (result.isConfirmed) {
            score = 0;
            gameLevel = 1;
            lines = 0;
            Init(); // 重新開始遊戲
        }
    });
}

/**
 * 更新畫面 gameMap、currentTetris、shadowTetris 
 */
function updateGameState(gameMap, currentTetris) {
    drawMap(gameMap);
    drawCurTetris(currentTetris);
    shadowTetris = getShadowTetris(currentTetris, gameMap);
    drawCurShadow(shadowTetris);
}

/**
 * 儲存當前Tetris，將更新currentTetris, nextTetris, saveTetris
 */
function saveTheTetris(currentTetris, nextTetris, saveTetris) {
    if(Object.keys(saveTetris).length === 0)
    {
        // console.log("SaveTetris is null.");
        currentTetris.rotate = ROTATE_0;
        Object.assign(saveTetris, currentTetris);
        Object.assign(currentTetris, nextTetris.dequeue());
        saveTetris.x = 4;
        saveTetris.y = 0;
    }
    else
    {
        // console.log("SaveTetris is not null.");
        // 交換currentTetris和saveTetris，並將saveTetris的(x, y)重置設為(4, 0)
        let tempTetris = { ...currentTetris };
        tempTetris.rotate = ROTATE_0;
        Object.assign(currentTetris, saveTetris);
        Object.assign(saveTetris, tempTetris);
        saveTetris.x = 4;
        saveTetris.y = 0;
    }
}

/**
 * 暫停遊戲畫面
 */
function pauseGame() {
    document.getElementById('pauseWindow').style.display = 'flex';
}

/**
 * 恢復遊戲畫面
 */
function resumeGame() {
    document.getElementById('pauseWindow').style.display = 'none';
}

/**
 * 處理按鍵
 */
document.addEventListener("keydown", (event) =>{
    // 第一次按下按鍵-->音樂重置
    if(firstKeyDown)
    {
        console.log("first keydown");
        backgroundMusic.start();
        firstKeyDown = false;
    }

    // console.log(event.key);
    // 複製當前Tetris狀態
    let newTetris = {...currentTetris};

    // 如果isPaused暫停中，僅允許按ESC鍵取消暫停，禁止其他按鍵
    if(!isPaused)
    {
        if(event.key === "ArrowLeft") 
        {
            newTetris.x--;
        }
        else if(event.key === "ArrowRight")
            {
            newTetris.x++;
        }
        else if(event.key === "ArrowDown") 
        {
            newTetris.y++;
        }
        else if(event.key === "ArrowUp") 
        {
            newTetris.rotate = (newTetris.rotate+1) % 4;
        }
        else if(event.key === " ")
        {
            newTetris.x = shadowTetris.x;
            newTetris.y = shadowTetris.y;
        }
        else if(event.key === "Control")
        {    
            saveTheTetris(currentTetris, nextTetris, saveTetris); // 將更新currentTetris, nextTetris, saveTetris
            newTetris = currentTetris;
            save.start();
        }
    }
    if(event.key === "Escape")
    {
        console.log("ESC");
        isPaused = !isPaused;
        if(isPaused)
        {
            pauseGame(); // 顯示暫停畫面
        }
        else
        {
            resumeGame(); // 隱藏暫停畫面
        }
    }

    // 檢查是否出界 或 重疊別的方塊
    if (!isOutOfBounds(newTetris) && !hasOverlappedOtherBlocks(newTetris, gameMap))
    {
        currentTetris = newTetris;
    }

    // 更新畫面
    updateGameState(gameMap, currentTetris);
    drawSaveTetris(saveTetris);
});

/**
 * 主遊戲迴圈：每隔280毫秒執行一次偵測。
 */
function gameLoop(){
    if(gameStart && !isPaused)
    {
        // console.log("timeout");
        let update = false;

        // 觸底 || 下方撞到地圖已有方塊 --> 放進gameMap中
        if(hasReachedBottom(currentTetris) || hasReachedOtherBlocksBottom(currentTetris, gameMap))
        {
            update = true;  
            // 放進gameMap中
            placeTetrisOnGameMap(gameMap, currentTetris);
            // 播放音效
            fall.start();
            // 加分
            score += 5;
            drawInfoAreaCanvas(score, gameLevel, lines); //更新info區的分數等資訊
        }

        // 檢查是否有需要消除的行
        // --> gameMap中去除這些列，並將上方所有列下移，直到下方已有其他方塊or觸底
        // --> 加分 
        let fullLines = checkGameMapLines(gameMap)
        if(fullLines.length > 0)
        {
            update = true;
            updateGameMap(gameMap, fullLines); // gameMap為傳址，會直接修改值
            lines += fullLines.length;
            score += fullLines.length * 10;
            gameLevel = Math.floor(1+lines / 11); // 每消除11行，增加1個Level
            backgroundMusic.setRate(1+gameLevel/30); // 設定背景音樂速度
            fullLines = [];
            drawInfoAreaCanvas(score, gameLevel, lines); //更新info區的分數等資訊
        }

        if(update)
        {
            // 更新畫面
            currentTetris = nextTetris.dequeue();
            updateGameState(gameMap, currentTetris);
            update = false;
        }

        // 檢查是否nextTetris有3個，若沒有就generate，並顯示於wating area
        if(nextTetris.size() < nextTetrisQuan)
        {
            nextTetris.enqueue(genRandomTetris());
            drawWatingTetris(nextTetris);
        }

        // 若gameMap中，最上排非background，表示有方塊觸頂
        // -->GameOver
        if(someBlocksReachTop(gameMap))
        {
            gameOver();
        }
    }
    setTimeout(gameLoop, 280);
}

/**
 * 自動降落
 */
function tetrisFallLoop(){
    if(gameStart && !isPaused)
    {
        let newTetris = {...currentTetris};
        newTetris.y++;
        // 檢查是否出界 或 重疊別的方塊
        if (!isOutOfBounds(newTetris) && !hasOverlappedOtherBlocks(newTetris, gameMap))
        {
            currentTetris = newTetris;
        }
        // 更新畫面
        updateGameState(gameMap, currentTetris);
    }
    setTimeout(tetrisFallLoop, 1500 / gameLevel);
}

function Init()
{
    gameMap = Array.from({ length: TETRIS_WIDTH}, ()=>Array(TETRIS_HEIGHT).fill(backgroundColor));
    currentTetris = genRandomTetris();
    drawGameCanvas();
    drawWaitingAreaCanvas();
    drawSaveAreaCanvas();
    drawInfoAreaCanvas(score, gameLevel, lines);
    updateGameState(gameMap, currentTetris);

    backgroundMusic.setLoop();
    backgroundMusic.setRate(1.0);

    gameStart = true;
    firstKeyDown = true;
    isPaused = false;

    // 初始隱藏「暫停畫面」
    resumeGame();

    gameLoop();
    tetrisFallLoop();
}

Init();