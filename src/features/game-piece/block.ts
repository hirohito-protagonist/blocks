import { SHAPES } from './shapes';

const randomizeTetrominoType = (noOfTypes: number): number => {
  return Math.floor(Math.random() * noOfTypes + 1);
};

export class BlockRecord {
  constructor(
    public x: number,
    public y: number,
    public color: string,
    public shape: number[][]
  ) {}

  rotate(): BlockRecord {
    const shape = this.copyArray(this.shape);
    for (let y = 0; y < shape.length; ++y) {
      for (let x = 0; x < y; ++x) {
        [shape[x][y], shape[y][x]] = [shape[y][x], shape[x][y]];
      }
    }
    return new BlockRecord(
      this.x,
      this.x,
      this.color,
      shape.map((row) => row.reverse())
    );
  }

  moveDown(): BlockRecord {
    return new BlockRecord(
      this.x,
      this.y + 1,
      this.color,
      this.copyArray(this.shape)
    );
  }

  moveLeft(): BlockRecord {
    return new BlockRecord(
      this.x - 1,
      this.y,
      this.color,
      this.copyArray(this.shape)
    );
  }

  moveRight(): BlockRecord {
    return new BlockRecord(
      this.x + 1,
      this.y,
      this.color,
      this.copyArray(this.shape)
    );
  }

  private copyArray(arr: number[][]): number[][] {
    return arr.map((v) => v.map((d) => d));
  }

  static withRandomShape(): BlockRecord {
    return new BlockRecord(
      3,
      0,
      '#A62991',
      SHAPES[randomizeTetrominoType(SHAPES.length - 1)]
    );
  }
}
