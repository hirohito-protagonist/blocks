import { GameInformation } from './GameInformation';

describe('GameInformation', () => {
  it('should create', () => {
    // Given
    const gameInformation = GameInformation.create();

    // When
    const result = gameInformation.current();

    // Then
    expect(result).toEqual({
      score: 0,
      level: 0,
      lines: 0,
    });
  });

  it.each`
    clearedLines | expectedPoints
    ${1}         | ${100}
    ${2}         | ${300}
    ${3}         | ${500}
    ${4}         | ${800}
  `(
    'should calculate points from cleared lines -> $clearedLines',
    ({ clearedLines, expectedPoints }) => {
      // Given
      const gameInformation = GameInformation.create();

      // When
      gameInformation.calculate(clearedLines);
      const result = gameInformation.current();

      // Then
      expect(result).toEqual({
        score: expectedPoints,
        level: 0,
        lines: 0,
      });
    }
  );
});
