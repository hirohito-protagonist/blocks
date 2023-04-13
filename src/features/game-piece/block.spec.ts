import { SHAPES } from './shapes';
import { BlockRecord } from './block';

describe('BlockRecord', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should create', () => {
        const block = new BlockRecord(3, 0, '#A62991', []);
        expect(block.x).toEqual(3);
        expect(block.y).toEqual(0);
        expect(block.color).toEqual('#A62991');
        expect(block.shape).toEqual([]);
    });

    it('should create with random shape', () => {
        const randomSpy = jest.spyOn(Math, 'random').mockReturnValue(0.99);
        const block = BlockRecord.withRandomShape();
        expect(block.x).toEqual(3);
        expect(block.y).toEqual(0);
        expect(block.color).toEqual('#A62991');
        expect(block.shape).toEqual(SHAPES[7]);
        expect(randomSpy).toHaveBeenCalledTimes(1);
    });

    it('should rotate', () => {
        const shape = [
            [0, 1, 0],
            [1, 1, 1],
            [0, 0, 0]
        ];
        const block = new BlockRecord(0, 0, '#A62991', shape);
        const rotate1 = block.rotate();
        const rotate2 = rotate1.rotate();
        const rotate3 = rotate2.rotate();
        const rotate4 = rotate3.rotate();
        const rotate5 = rotate4.rotate();

        expect(rotate1.shape).toEqual([
            [0, 1, 0],
            [0, 1, 1],
            [0, 1, 0]
        ]);
        expect(rotate2.shape).toEqual([
            [0, 0, 0],
            [1, 1, 1],
            [0, 1, 0]
        ]);
        expect(rotate3.shape).toEqual([
            [0, 1, 0],
            [1, 1, 0],
            [0, 1, 0]
        ]);
        expect(rotate4.shape).toEqual([
            [0, 1, 0],
            [1, 1, 1],
            [0, 0, 0]
        ]);
        expect(rotate5.shape).toEqual([
            [0, 1, 0],
            [0, 1, 1],
            [0, 1, 0]
        ]);
    });
});