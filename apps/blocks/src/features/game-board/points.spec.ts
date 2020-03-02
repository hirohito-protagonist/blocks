import { getLinesClearedPoints } from './points';

describe('points', () => {

  describe('getLinesClearedPoints', () => {

    it('should return 0 by default', () => {
      // Given
      const lines = 0;
      const level = 0;

      // When
      const result = getLinesClearedPoints(lines, level);

      // Then
      expect(result).toEqual(0);
    });

    it('should calculate for single line', () => {
      // Given
      const lines = 1;
      const level = 0;

      // When
      const result = getLinesClearedPoints(lines, level);

      // Then
      expect(result).toEqual(100);
    });

    it('should calculate for double lines', () => {
      // Given
      const lines = 2;
      const level = 0;

      // When
      const result = getLinesClearedPoints(lines, level);

      // Then
      expect(result).toEqual(300);
    });

    it('should calculate for triple lines', () => {
      // Given
      const lines = 3;
      const level = 0;

      // When
      const result = getLinesClearedPoints(lines, level);

      // Then
      expect(result).toEqual(500);
    });
  });
});
