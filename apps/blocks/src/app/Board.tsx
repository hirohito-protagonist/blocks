import React, {useEffect, createRef, useRef} from 'react';
import { COLUMNS, ROWS, BLOCK_SIZE, KEY } from './constants';
import { Piece, IPiece } from './piece';
import { isNotInCollision } from './collision';
import { rotate } from './rotate';

export default function Board() {

    let grid = Array.from({ length: ROWS }, () => Array(COLUMNS).fill(0));
    let time: { start: number; elapsed: number; level: number } = { start: 0, elapsed: 0, level: 800 };
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

    const freeze = () => {
        piece.current.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value > 0) {
                    grid[y + piece.current.y][x + piece.current.x] = value;
                }
            });
        });
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

    const drop = () => {
        let p = moves[KEY.DOWN](piece.current);
        if (isNotInCollision(p, grid)) {
            piece.current.move(p);
        } else {
            freeze();
            grid = clearLines(grid);
            if (piece.current.y === 0) {
                return false;
            }
            piece.current = new Piece(getContext());
        }

        return true;
    };

    const animate = (now = 0) => {
        time.elapsed = now - time.start;
        if (time.elapsed > time.level) {
            time.start = now;
            if (!drop()) {
                return;
            }
        }
        const ctx = getContext();
        drawBoard(ctx);
        piece.current.draw();
        window.requestAnimationFrame(animate);
    };

    const handlePlay = () => {
        time.start = performance.now();
        animate();
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
        </>
    );
};