import { PieceType } from './types';
import { isNotInCollision } from './collision';

describe('isNotInCollision', () => {

  it('should return true when piece is in board and touch anything', () => {

    // Given
    const piece: PieceType = {
      color: '',
      shape: [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0]
      ],
      x: 1,
      y: 2
    };
    const board: number[][] = [
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0]
    ];

    // When
    const result = isNotInCollision(piece, board);

    // Then
    expect(result).toEqual(true);
  });

  it('should return false when piece is touch wall', () => {

    // Given
    const piece: PieceType = {
      color: '',
      shape: [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0]
      ],
      x: -1,
      y: 2
    };
    const board: number[][] = [
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0]
    ];

    // When
    const result = isNotInCollision(piece, board);

    // Then
    expect(result).toEqual(false);
  });

  it('should return false when piece touch other pieces', () => {

    // Given
    const piece: PieceType = {
      color: '',
      shape: [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0]
      ],
      x: 1,
      y: 2
    };
    const board: number[][] = [
      [0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0],
      [0, 1, 1, 0, 1, 1, 0],
      [1, 1, 1, 1, 1, 1, 1]
    ];

    // When
    const result = isNotInCollision(piece, board);

    // Then
    expect(result).toEqual(false);
  });
});
