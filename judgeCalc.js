import { rotate } from "./tetrisSetting.js";
import { GAME_CANVAS_STARTX, GAME_CANVAS_STARTY, 
         TETRIS_WIDTH, TETRIS_HEIGHT,
         BLOCK_SIZE,
         backgroundColor} from "./gameSettingParams.js"

/**
 * 判斷tetris是否超出邊界
 */
export function isOutOfBounds(tetris) {
    return getTetrisCoords(tetris).some(({x, y}) =>
        x < 0 || x >= TETRIS_WIDTH || y >= TETRIS_HEIGHT
    );
}

/**
 * 判斷tetris是否觸底
 */
export function hasReachedBottom(tetris)
{
    return getTetrisCoords(tetris).some(({x, y}) =>
        y === TETRIS_HEIGHT-1
    );
}

/**
 * 判斷tetris是否下方將撞到別的方塊
 */
export function hasReachedOtherBlocksBottom(tetris, gameMap)
{
    return getTetrisCoords(tetris).some(({x, y}) =>
        gameMap[x][y+1] != backgroundColor
    );
}

/**
 * 判斷tetris是否與其他方塊重疊
 */
export function hasOverlappedOtherBlocks(tetris, gameMap)
{
    return getTetrisCoords(tetris).some(({x, y}) =>
        gameMap[x][y] != backgroundColor
    );
}

/**
 * 是否有Tetris block已觸頂
 */
export function someBlocksReachTop(gameMap){
    // 檢查row為0的column是否為background
    for(let col = 0; col < TETRIS_WIDTH; col++)
    {
        if(gameMap[col][0] != backgroundColor)
        {
            return true;
        }
    }
    return false;
}

/**
 * 取得Tetris內的每個block的座標
 */
export function getTetrisCoords(tetris) {
    // 將返回旋轉過後的Tetris之遊戲座標
    let thisRotateTetris = rotate(tetris);
    // console.log("thisRotateTetris: ", thisRotateTetris);
    return thisRotateTetris.map( index => {
        // It's 6 because the 6th block is the center block.
        let relX = (index % 4) - 2;
        let relY = Math.floor(index / 4);
        // console.log("relX: ", relX, " relY: ", relY);
        return { x: tetris.x + relX, y: tetris.y + relY};
    });
}

/**
 * 取得currentTetris的影子shadowTetris
 */
export function getShadowTetris(tetris, gameMap) {
    let shadowTetris = { ...tetris };
    // 增加tetris的y偏移量，直到下方撞到其他方塊或觸底
    while(!hasReachedBottom(shadowTetris) && !hasReachedOtherBlocksBottom(shadowTetris, gameMap))
    {
        shadowTetris.y++;
    }
    shadowTetris.color
    return shadowTetris;
}