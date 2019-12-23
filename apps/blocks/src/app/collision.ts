import { IPiece } from './piece';
import { COLUMNS, ROWS } from './constants';

const isEmpty = (value: number): boolean => value === 0;
const insideWalls = (x: number): boolean => x >= 0 && x < COLUMNS;
const aboveFloor = (y: number): boolean => y <= ROWS;
const notOccupied = (board: number[][], x: number, y: number): boolean => board[y] && board[y][x] === 0;

export const isNotInCollision = (p: IPiece, board: number[][]): boolean => {

    return p.shape.every((row, dy) => {
        return row.every((value, dx) => {
            const x = p.x + dx;
            const y = p.y + dy;
            return (
                isEmpty(value) ||
                (insideWalls(x) && aboveFloor(y) && notOccupied(board, x, y))
            );
        });
    });
};