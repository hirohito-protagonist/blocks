import React, {useEffect, createRef, useRef, MutableRefObject} from 'react';
import { COLUMNS, ROWS, BLOCK_SIZE, KEY, LEVEL } from './constants';
import { Piece, IPiece } from './piece';
import { isNotInCollision } from './collision';
import { rotate } from './rotate';

export default function Board() {

    let grid = Array.from({ length: ROWS }, () => Array(COLUMNS).fill(0));
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

    const drawBoard = (ctx: CanvasRenderingContext2D) => {
        ctx.canvas.width = COLUMNS * BLOCK_SIZE;
        ctx.canvas.height = ROWS * BLOCK_SIZE;
        ctx.scale(BLOCK_SIZE, BLOCK_SIZE);
        grid.forEach((row: any[], y) => {
            row.forEach((value, x) => {
                if (value > 0) {
                    ctx.fillStyle = 'green';
                    ctx.fillRect(x, y, 1, 1);
                }   
            });
        });
        addOutlines(ctx);
    };

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

    const drop = (p: MutableRefObject<Piece>): boolean => {
        let newPiece = moves[KEY.DOWN](p.current);
        if (isNotInCollision(newPiece, grid)) {
            p.current.move(newPiece);
        } else {
            grid = freeze(p, grid);
            grid = clearLines(grid);
            level = level <= 10 ? level + 1 : level;
            time.level = LEVEL[level];
            if (p.current.y === 0) {
                return false;
            }
            p.current = new Piece(getContext());
        }

        return true;
    };

    const gameOver = (ctx: CanvasRenderingContext2D): void => {
        ctx.fillStyle = 'green';
        ctx.fillRect(1, 3, 8, 1.2);
        ctx.font = '1px Arial';
        ctx.fillStyle = 'white';
        ctx.fillText('GAME OVER', 1.8, 4);
    };

    const animate = (now = 0) => {
        const ctx = getContext();
        time.elapsed = now - time.start;
        if (time.elapsed > time.level) {
            time.start = now;
            if (!drop(piece)) {
                gameOver(ctx);
                return;
            }
        }
        drawBoard(ctx);
        piece.current.draw();
        window.requestAnimationFrame(animate);
    };

    const handlePlay = () => {
        time.start = performance.now();
        animate();
    };

    const handleReset = () => {
        grid = Array.from({ length: ROWS }, () => Array(COLUMNS).fill(0));
        time = { start: 0, elapsed: 0, level: LEVEL[0] };
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
            drawBoard(ctx);
            piece.current.draw();
        }
    };
    
    useEffect(() => {
        const ctx = getContext();
        const p = new Piece(ctx);
        drawBoard(ctx);
        p.draw();
        piece.current = p;
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
            <button onClick={handlePlay}>Play</button>
            <button onClick={handleReset}>Reset</button>
        </>
    );
};