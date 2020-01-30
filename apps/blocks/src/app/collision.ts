import { IPiece } from './piece';

const isEmpty = (value: number): boolean => value === 0;
const insideWalls = (x: number, columns: number): boolean => x >= 0 && x < columns;
const aboveFloor = (y: number, rows: number): boolean => y <= rows;
const notOccupied = (board: number[][], x: number, y: number): boolean => board[y] && board[y][x] === 0;

export const isNotInCollision = (p: IPiece, board: number[][]): boolean => {

  const rows = board.length;
  const columns = board[0].length
  return p.shape.every((row, dy) => {
    return row.every((value, dx) => {
      const x = p.x + dx;
      const y = p.y + dy;
      return (
        isEmpty(value) ||
        (insideWalls(x, columns) && aboveFloor(y, rows) && notOccupied(board, x, y))
      );
    });
  });
};
