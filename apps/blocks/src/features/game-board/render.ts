import { COLUMNS, ROWS, BLOCK_SIZE } from '../../common/constants';
import { addOutlines } from './util';

export const drawBoard = (ctx: CanvasRenderingContext2D, board: number[][]): void => {
  ctx.canvas.width = COLUMNS * BLOCK_SIZE;
  ctx.canvas.height = ROWS * BLOCK_SIZE;
  ctx.scale(BLOCK_SIZE, BLOCK_SIZE);
  board.forEach((row: number[], y) => {
    row.forEach((value, x) => {
      if (value > 0) {
        ctx.fillStyle = '#711673';
        ctx.fillRect(x, y, 1, 1);
      }
    });
  });
  addOutlines(ctx);
};

export const gameOver = (ctx: CanvasRenderingContext2D): void => {
  ctx.fillStyle = '#711673';
  ctx.fillRect(1, 3, 8, 1.2);
  ctx.font = '1px Arial';
  ctx.fillStyle = 'white';
  ctx.fillText('GAME OVER', 1.8, 4);
};
