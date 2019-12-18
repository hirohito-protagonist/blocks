
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
        this.shape = [
            [1, 1],
            [1, 1]
        ];
        this.color = 'red';
        this.x = 3;
        this.y = 0;
    }

    draw() {
        this.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                this.ctx.fillStyle = 'red';
                const currentX = this.x + x;
                const currentY = this.y + y;
                this.ctx.fillRect(currentX, currentY, 1, 1);
            });
        });
    }
}