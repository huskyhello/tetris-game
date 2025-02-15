import { GAME_CANVAS_STARTX, GAME_CANVAS_STARTY, 
    TETRIS_WIDTH, TETRIS_HEIGHT,
    BLOCK_SIZE,
    backgroundColor} from "./gameSettingParams.js";
import { getTetrisCoords } from "./judgeCalc.js";

/**
 * 判斷有哪些Lines已滿，回傳已滿Lines的列表
 */
export function checkGameMapLines(gameMap) {
    let fullLines = [];
    for(let row = 0; row < TETRIS_HEIGHT; row++)
    {
        let add = true;
        // 若row全非backgroundColor，該row加入列表
        for(let col = 0; col < TETRIS_WIDTH; col++)
        {
            if(gameMap[col][row] == backgroundColor)
            {
                add = false;
                break;
            }
        }
        if(add === true)
        {
            // console.log("full row: ", row);
            fullLines.push(row);
        }
    }
    return fullLines;
}

/**
 * 將gameMap的已滿Lines消除，並將其上方的rows下移
 */
export function updateGameMap(gameMap, fullLines) {
    let newGameMap = Array.from({ length: TETRIS_WIDTH}, ()=>Array(TETRIS_HEIGHT).fill(backgroundColor));
    let newGameMapPtr = TETRIS_HEIGHT-1;
    // 只留下未滿Lines
    // row非全backgroundColor，且row不在fullLines中，就加入新gameMap
    for(let row = TETRIS_HEIGHT-1; row >= 0; row--)
    {
        let add = false;
        // 若row非全backgroundColor
        for(let col = 0; col < TETRIS_WIDTH; col++)
        {
            if(gameMap[col][row] != backgroundColor)
            {
                let isInFull = false;
                // 若row不在fullLines中
                for(let i = 0; i < fullLines.length; i++)
                {
                    if(row === fullLines[i])
                    {
                        isInFull = true;
                        break;
                    }
                }
                if(!isInFull)
                {
                    add = true;
                    break;
                }
            }
        }
        if(add === true)
        {
            // console.log("未滿Line: ", row);
            // 將該row放進newGameMap中
            for (let col = 0; col < TETRIS_WIDTH; col++) {
                // console.log("col: ", col, " row: ", newGameMapPtr, " color: ", gameMap[col][row]);
                newGameMap[col][newGameMapPtr] = gameMap[col][row]; 
            }
            // console.log("newGameMapPtr: ", newGameMapPtr);
            newGameMapPtr--;
        }
    }


    // test
    // for(let col = 0; col < TETRIS_WIDTH; col++)
    // {
    //     for(let row = 0; row < TETRIS_HEIGHT; row++)
    //     {
    //         let thisColor = newGameMap[col][row] ?? backgroundColor;
    //         // console.log("col: ", col, " row: ", row, " color: ", thisColor);
    //     }
    // }

    Object.assign(gameMap, newGameMap);

}

/**
 * 將Tetris放入當前gameMap中
 */
export function placeTetrisOnGameMap(gameMap, currentTetris){
    getTetrisCoords(currentTetris).forEach(block => {
        gameMap[block.x][block.y] = currentTetris.color;
    });
}