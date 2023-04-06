import { SHAPES } from './shapes';

const randomizeTetrominoType = (noOfTypes: number): number => {
    return Math.floor(Math.random() * noOfTypes + 1);
}

export class BlockRecord {
    constructor(public x: number, public y: number, public color: string, public shape: number[][]) {}

    static withRandomShape(): BlockRecord {
        return new BlockRecord(3, 0, '#A62991', SHAPES[randomizeTetrominoType(SHAPES.length - 1)]);
    }
}