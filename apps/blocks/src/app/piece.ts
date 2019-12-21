import { SHAPES } from './constants';

export interface IPiece {
    x: number;
    y: number;
    color: string;
    shape: number[][];
}

export class Piece implements IPiece {

    x: number;
    y: number;
    color: string;
    shape: number[][];

    constructor(private ctx: CanvasRenderingContext2D) {
        this.spawn();
    }

    spawn() {
        this.shape = SHAPES[this.randomizeTetrominoType(6)];
        this.color = 'red';
        this.x = 3;
        this.y = 0;
    }

    draw() {
        this.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value > 0) {
                    this.ctx.fillStyle = 'red';
                    const currentX = this.x + x;
                    const currentY = this.y + y;
                    this.ctx.fillRect(currentX, currentY, 1, 1);
                }
            });
        });
    }

    private randomizeTetrominoType(noOfTypes: number): number {
        return Math.floor(Math.random() * noOfTypes + 1);
    }
}