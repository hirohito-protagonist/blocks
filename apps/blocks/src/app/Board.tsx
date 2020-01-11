import React, {useEffect, createRef, useRef, MutableRefObject} from 'react';
import { COLUMNS, ROWS, BLOCK_SIZE, KEY, LEVEL } from './constants';
import { Piece, IPiece } from './piece';
import { isNotInCollision } from './collision';
import { rotate } from './rotate';

const createEmptyBoard = () => Array.from({ length: ROWS }, () => Array(COLUMNS).fill(0));

const freeze = (p: MutableRefObject<Piece>, board: number[][]): number[][] => {
    const g = [...board];
    p.current.shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value > 0) {
                g[y + p.current.y][x + p.current.x] = value;
            }
        });
    });
    return g;
};

const addOutlines = (ctx: CanvasRenderingContext2D) => {
    for (let i = 0; i < COLUMNS; i++) {
        ctx.fillStyle = 'black';
        ctx.fillRect(i, 0, 0.025, ctx.canvas.height);
    }
    for (let i = 0; i < ROWS; i++) {
        ctx.fillStyle = 'black';
        ctx.fillRect(0, i, ctx.canvas.width, 0.025);
    }
};

const clearLines = (board: number[][]): number[][] => {
    const g = [...board];
    g.forEach((row, y) => {
        if (row.every(value => value !== 0)) {
            g.splice(y, 1);
            g.unshift(Array(COLUMNS).fill(0));
        }
    });
    return g;
};

const drawBoard = (ctx: CanvasRenderingContext2D, board:number[][]): void => {
    ctx.canvas.width = COLUMNS * BLOCK_SIZE;
    ctx.canvas.height = ROWS * BLOCK_SIZE;
    ctx.scale(BLOCK_SIZE, BLOCK_SIZE);
    board.forEach((row: any[], y) => {
        row.forEach((value, x) => {
            if (value > 0) {
                ctx.fillStyle = 'green';
                ctx.fillRect(x, y, 1, 1);
            }   
        });
    });
    addOutlines(ctx);
};

const gameOver = (ctx: CanvasRenderingContext2D): void => {
    ctx.fillStyle = 'green';
    ctx.fillRect(1, 3, 8, 1.2);
    ctx.font = '1px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText('GAME OVER', 1.8, 4);
};

const useGameLoop = (callback) => {

    const requestRef = useRef<number>();

    const animate = (time) => {
        callback(time);
        requestRef.current = requestAnimationFrame(animate);
    };

    useEffect(() => {
        requestRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(requestRef.current);
    }, []);
};

const Board = () => {

    let isGameStarted = false;
    let grid = createEmptyBoard();
    let level = 0;
    let time: { start: number; elapsed: number; level: number } = { start: 0, elapsed: 0, level: LEVEL[level] };
    
    const piece = useRef<Piece>();
    const moves = {
        [KEY.LEFT]: (p: IPiece): IPiece => ({ ...p, x: p.x - 1}),
        [KEY.RIGHT]: (p: IPiece): IPiece => ({ ...p, x: p.x + 1}),
        [KEY.DOWN]: (p: IPiece): IPiece => ({ ...p, y: p.y + 1}),
        [KEY.SPACE]: (p: IPiece): IPiece => ({ ...p, y: p.y + 1}),
        [KEY.UP]: (p: IPiece): IPiece => rotate(p)
    };
    let canvasCntext = createRef();

    const getContext = (): CanvasRenderingContext2D =>  {
        const canvas: HTMLCanvasElement = canvasCntext.current;
        return canvas.getContext('2d');
    };

    const drop = (p: MutableRefObject<Piece>): boolean => {
        let newPiece = moves[KEY.DOWN](p.current);
        if (isNotInCollision(newPiece, grid)) {
            p.current.move(newPiece);
        } else {
            grid = freeze(p, grid);
            grid = clearLines(grid);
            level = level < 10 ? level + 1 : level;
            time.level = LEVEL[level];
            if (p.current.y === 0) {
                return false;
            }
            p.current = new Piece(getContext());
        }

        return true;
    };

    useGameLoop((deltaTime) => {
        
        if (isGameStarted) {
            const ctx = getContext();
            time.elapsed = deltaTime - time.start;
            if (time.elapsed > time.level) {
                time.start = deltaTime;
                if (!drop(piece)) {
                    isGameStarted = false;
                    gameOver(ctx);
                    return;
                }
            }
            drawBoard(ctx, grid);
            piece.current.draw();
        }
        
    });

    const handlePlay = () => {
        const ctx = getContext();
        piece.current = new Piece(ctx);
        time.start = performance.now();
        isGameStarted = true;
    };

    const handleReset = () => {
        level = 0;
        grid = createEmptyBoard();
        time = { start: 0, elapsed: 0, level: LEVEL[level] };
        isGameStarted = true;
    };

    const keyEvent = (event: KeyboardEvent) => {
        
        if (moves[event.keyCode]) {
            let p = moves[event.keyCode](piece.current);
            const ctx = getContext();
            if (event.keyCode === KEY.SPACE) {
                while (isNotInCollision(p, grid)) {
                    piece.current.move(p);
                    p = moves[KEY.DOWN](piece.current);
                }
            }
            else if (isNotInCollision(p, grid)) {
                piece.current.move(p);
            }
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            drawBoard(ctx, grid);
            piece.current.draw();
        }
    };
    
    useEffect(() => {
        const ctx = getContext();
        drawBoard(ctx, grid);
        piece.current = null;
    }, []);

    useEffect(() => {

        document.addEventListener('keydown', keyEvent);
        return () => {
            document.removeEventListener('keydown', keyEvent);
        };
    }, []);
    
    return (
        <>
            <canvas ref={canvasCntext} className="c-game-board"></canvas>
            <button onClick={handlePlay} onKeyDown={(e) => e.preventDefault()}>Play</button>
            <button onClick={handleReset} onKeyDown={(e) => e.preventDefault()}>Reset</button>
        </>
    );
};

export default Board;
