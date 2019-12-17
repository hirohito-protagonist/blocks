import React, {useEffect, createRef} from 'react';
import { COLUMNS, ROWS, BLOCK_SIZE } from './constants';

export default function Board() {

    const grid = Array.from({ length: ROWS }, () => Array(COLUMNS).fill(0));
    let canvasCntext = createRef();

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

    const drawBoard = () => {
        const canvas: HTMLCanvasElement = canvasCntext.current;
        const context: CanvasRenderingContext2D = canvas.getContext('2d');
        context.canvas.width = COLUMNS * BLOCK_SIZE;
        context.canvas.height = ROWS * BLOCK_SIZE;
        context.scale(BLOCK_SIZE, BLOCK_SIZE);
        grid.forEach((row: any[], y) => {
            row.forEach((value, x) => {
                if (value > 0) {
                    context.fillStyle = 'green';
                    context.fillRect(x, y, 1, 1);
                }
            });
        });
        addOutlines(context);
    };

    const handlePlay = () => {
        console.log(canvasCntext.current);
        drawBoard();
    };
    
    useEffect(() => {
        drawBoard();
    });
    
    return (
        <>
            <canvas ref={canvasCntext} className="c-game-board"></canvas>
            <button onClick={handlePlay}>Play</button>
        </>
    );
};