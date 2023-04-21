import { BoardManager } from './BoardManager';

describe('BoardManager', () => {
  describe('isNotInCollision', () => {
    it('should return true when block is in board and touch anything', () => {
      // Given
      const block = {
        shape: [
          [0, 1, 0],
          [1, 1, 1],
          [0, 0, 0],
        ],
        x: 1,
        y: 2,
      };
      const boardManager = BoardManager.createEmpty(7, 4);

      // When
      const result = boardManager.isNotInCollision(block);

      // Then
      expect(result).toEqual(true);
    });

    it('should return false when piece is touch wall', () => {
      // Given
      const block = {
        shape: [
          [0, 1, 0],
          [1, 1, 1],
          [0, 0, 0],
        ],
        x: -1,
        y: 2,
      };
      const boardManager = BoardManager.createEmpty(7, 4);

      // When
      const result = boardManager.isNotInCollision(block);

      // Then
      expect(result).toEqual(false);
    });
  });
});
