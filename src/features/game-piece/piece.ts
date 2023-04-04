import { SHAPES } from './shapes';
import { PieceType } from '../../common';


export class Piece implements PieceType {

  x!: number;
  y!: number;
  color!: string;
  shape!: number[][];

  constructor(private ctx: CanvasRenderingContext2D) {
    this.spawn();
  }

  spawn() {
    this.shape = SHAPES[this.randomizeTetrominoType(7)];
    this.color = '#A62991';
    this.x = 3;
    this.y = 0;
  }

  move(p: PieceType): void {
    this.x = p.x;
    this.y = p.y;
    this.shape = p.shape;
  }

  private randomizeTetrominoType(noOfTypes: number): number {
    return Math.floor(Math.random() * noOfTypes + 1);
  }
}

export const pieceRender = (p: Piece, ctx: CanvasRenderingContext2D) => {
  p.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value > 0) {
        ctx.fillStyle = p.color;
        const currentX = p.x + x;
        const currentY = p.y + y;
        ctx.fillRect(currentX, currentY, 1, 1);
      }
    });
  });
};
