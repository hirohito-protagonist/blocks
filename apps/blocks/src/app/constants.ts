export const COLUMNS = 10;
export const ROWS = 20;
export const BLOCK_SIZE = 30;

export const SHAPES = [
    [],
    [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ],
    [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0]
    ],
    [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0]
    ],
    [
        [1, 1],
        [1, 1]
    ],
    [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0]
    ],
    [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0]
    ],
    [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0]
    ]
];

export class KEY {
    static readonly LEFT = 37;
    static readonly RIGHT = 39;
    static readonly DOWN = 40;
    static readonly UP = 38;
    static readonly SPACE = 32;
    static readonly ESC = 27;
}

export class LEVEL {
    static readonly 0 = 800;
    static readonly 1 = 720;
    static readonly 2 = 630;
    static readonly 3 = 550;
    static readonly 4 = 470;
    static readonly 5 = 380;
    static readonly 6 = 300;
    static readonly 7 = 220;
    static readonly 8 = 130;
    static readonly 9 = 100;
    static readonly 10 = 80;
  }

  export class POINTS {
      static readonly SINGLE = 100;
      static readonly DOUBLE = 300;
      static readonly TRIPLE = 500;
      static readonly TETRIS = 800;
  }