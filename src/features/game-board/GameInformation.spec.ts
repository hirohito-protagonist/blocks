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
        lines: clearedLines,
      });
    }
  );

  it('should increase level each time the five lines are cleared', () => {
    // Given
    const gameInformation = GameInformation.create();

    // When
    for (let i = 0; i < 6; i++) {
      gameInformation.calculate(1);
    }
    for (let i = 0; i < 6; i++) {
      gameInformation.calculate(1);
    }
    const result = gameInformation.current();

    // Then
    expect(result).toEqual({
      score: 300,
      level: 2,
      lines: 1,
    });
  });

  it('should add points', () => {
    // Given
    const gameInformation = GameInformation.create();

    // When
    gameInformation.addScore(10);
    gameInformation.addScore(20);
    const result = gameInformation.current();

    // Then
    expect(result).toEqual({
      score: 30,
      level: 0,
      lines: 0,
    });
  });
});
