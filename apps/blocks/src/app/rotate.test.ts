import { IPiece } from './piece';
import { rotate } from './rotate';
describe('rotate', () => {

  it('should transpose a Piece shape', () => {

    // Given
    const piece: IPiece = {
      color: '',
      shape: [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0]
      ],
      x: 0,
      y: 0
    };

    // When
    const rotate1 = rotate(piece);
    const rotate2 = rotate(rotate1);
    const rotate3 = rotate(rotate2);
    const rotate4 = rotate(rotate3);

    // Then
    expect(rotate1).toEqual({
      color: '',
      shape: [
        [0, 1, 0],
        [0, 1, 1],
        [0, 1, 0]
      ],
      x: 0,
      y: 0
    });

    expect(rotate2).toEqual({
      color: '',
      shape: [
        [0, 0, 0],
        [1, 1, 1],
        [0, 1, 0]
      ],
      x: 0,
      y: 0
    });

    expect(rotate3).toEqual({
      color: '',
      shape: [
        [0, 1, 0],
        [1, 1, 0],
        [0, 1, 0]
      ],
      x: 0,
      y: 0
    });

    expect(rotate4).toEqual({
      color: '',
      shape: [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0]
      ],
      x: 0,
      y: 0
    });
  });
});
