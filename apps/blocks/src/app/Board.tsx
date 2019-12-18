import React, {useEffect, createRef} from 'react';
import { COLUMNS, ROWS, BLOCK_SIZE } from './constants';
import { Piece, IPiece } from './piece';

export default function Board() {

    const grid = Array.from({ length: ROWS }, () => Array(COLUMNS).fill(0));
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

    const drawBoard = () => {
        const context = getContext();
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
        const ctx = getContext();
        const piece = new Piece(ctx);
        drawBoard();
        piece.draw();
    };
    
    useEffect(() => {
        const ctx = getContext();
        const piece = new Piece(ctx);
        drawBoard();
        piece.draw();
    });
    
    return (
        <>
            <canvas ref={canvasCntext} className="c-game-board"></canvas>
            <button onClick={handlePlay}>Play</button>
        </>
    );
};