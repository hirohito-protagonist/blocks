const isEmpty = (value: number): boolean => value === 0;
const insideWalls = (x: number, columns: number): boolean => x >= 0 && x < columns;
const aboveFloor = (y: number, rows: number): boolean => y <= rows;
const notOccupied = (board: number[][], x: number, y: number): boolean => board[y] && board[y][x] === 0;

export class BoardManager {
  private board: number[][];
  constructor(private columns: number, private rows: number) {
    this.board = Array.from({ length: this.rows }, () =>
      Array(this.columns).fill(0)
    );
  }

  isNotInCollision(p: { shape: number[][]; x: number; y: number }): boolean {
    const rows = this.rows;
    const columns = this.columns;
    return p.shape.every((row, dy) => {
      return row.every((value, dx) => {
        const x = p.x + dx;
        const y = p.y + dy;
        return (
          isEmpty(value) ||
          (insideWalls(x, columns) && aboveFloor(y, rows) && notOccupied(this.board, x, y))
        );
      });
    });
  }

  freeze(p: { shape: number[][]; x: number; y: number }) {
    p.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value > 0) {
          this.board[y + p.y][x + p.x] = value;
        }
      });
    });
  }

  clearLines(): number {
    let lines = 0;

    this.board.forEach((row, y) => {
      if (row.every((value) => value !== 0)) {
        lines++;
        this.board.splice(y, 1);
        this.board.unshift(Array(this.columns).fill(0));
      }
    });
    return lines;
  }

  clear() {
    this.board = Array.from({ length: this.rows }, () =>
      Array(this.columns).fill(0)
    );
  }

  getBoard(): number[][] {
    return this.copyArray(this.board);
  }

  private copyArray(arr: number[][]): number[][] {
    return arr.map((v) => v.map((d) => d));
  }

  static createEmpty(columns: number, rows: number): BoardManager {
    return new BoardManager(columns, rows);
  }
}
