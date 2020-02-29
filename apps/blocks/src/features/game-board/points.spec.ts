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
  });
});
