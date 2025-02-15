/**
 * Define the Tetris.
 */
/*
 0 1 2 3 
 4 5 6 7 
 8 9 10 11 
 12 13 14 15
*/
export const TetrisType = Object.freeze({
    I: [0, 1, 2, 3],
    J: [1, 5, 6, 7],
    L: [3, 5, 6, 7],
    O: [2, 3, 6, 7],
    S: [2, 3, 5, 6],
    T: [2, 5, 6, 7],
    Z: [1, 2, 6, 7]
});

export const TetrisColor = Object.freeze({
    I: "#b2bee1", 
    J: "#91c4e8", 
    L: "#80bfb0", 
    O: "#ef9d6a", 
    S: "#fcd849",
    T: "#d2a8b3",
    Z: "#e35d44" 
});

// 順時針旋轉
export const ROTATE_0 = 0;
export const ROTATE_90 = 1;
export const ROTATE_180 = 2;
export const ROTATE_270 = 3;

// export default { ROTATE_0, ROTATE_90, ROTATE_180, ROTATE_270 };

export function rotate(tetris)
{
    let afterRotate = [];
    let a = new Array(16).fill(0);
    tetris.type.map(index => {
        a[index] = 1;
    });
    /*
        取得: {1, 1, 1, 1,
               0, 0, 0, 0, 
               0, 0, 0, 0, 
               0, 0, 0, 0} 類似型態
    */
   /*
        a[0] a[1] a[2] a[3]
        a[4] a[5] a[6] a[7]
        a[8] a[9] a[10] a[11]
        a[12] a[13] a[14] a[15]

        轉換成

        a[12] a[8] a[4] a[0]
        a[13] a[9] a[5] a[1]
        a[14] a[10] a[6] a[2]
        a[15] a[11] a[7] a[3]
   */
    let rot = [12, 8, 4, 0,
               13, 9, 5, 1,
               14, 10, 6, 2,
               15, 11, 7, 3,
              ];
    let after_a = a.slice();
    for( let re = 0; re < tetris.rotate; re++)
    {
        after_a = a.slice();
        for (let i = 0; i < 16; i++)
        {
            after_a[i] = a[rot[i]];
        }
        a = after_a.slice();     
    }
    // console.log(after_a);
    after_a.forEach((value, index) => {
        if (value === 1){
            afterRotate.push(index);
        }
    });
    return afterRotate;
}

/**
 * 隨機生成Tetris
 */
export function genRandomTetris()
{
    // 取得所有 Tetris 種類 I, J, L, O, S, T, Z
    const types = Object.keys(TetrisType);
    // 隨機選一種
    const randomType = types[Math.floor(Math.random() * types.length)];
    return {
        type: TetrisType[randomType],
        color: TetrisColor[randomType],
        rotate: ROTATE_0,
        x: 4,
        y: 0
    };
}