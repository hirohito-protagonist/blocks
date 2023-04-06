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
});