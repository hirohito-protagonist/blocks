import { Piece } from '../game-piece';
import { MutableRefObject } from 'react';
import { COLUMNS, ROWS } from '../../common/constants';

export const createEmptyBoard = () => Array.from({ length: ROWS }, () => Array(COLUMNS).fill(0));

export const freeze = (p: MutableRefObject<Piece>, board: number[][]): number[][] => {
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

export const addOutlines = (ctx: CanvasRenderingContext2D) => {
  for (let i = 0; i < COLUMNS; i++) {
    ctx.fillStyle = '#511159';
    ctx.fillRect(i, 0, 0.025, ctx.canvas.height);
  }
  for (let i = 0; i < ROWS; i++) {
    ctx.fillStyle = '#511159';
    ctx.fillRect(0, i, ctx.canvas.width, 0.025);
  }
};

export const clearLines = (board: number[][]): { board: number[][]; clearedLines: number; } => {

  let lines = 0;
  const g = [...board];
  g.forEach((row, y) => {
    if (row.every(value => value !== 0)) {
      lines++;
      g.splice(y, 1);
      g.unshift(Array(COLUMNS).fill(0));
    }
  });
  return {
    board: g,
    clearedLines: lines
  };
};
