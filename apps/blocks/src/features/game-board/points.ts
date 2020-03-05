export class POINTS {
  static readonly SINGLE = 100;
  static readonly DOUBLE = 300;
  static readonly TRIPLE = 500;
  static readonly TETRIS = 800;
  static readonly SOFT_DROP = 1;
  static readonly HARD_DROP = 2;
}

export const getLinesClearedPoints = (lines: number, level: number): number => {
  const lineClearPoints =
    lines === 1
      ? POINTS.SINGLE
      : lines === 2
        ? POINTS.DOUBLE
        : lines === 3
          ? POINTS.TRIPLE
          : lines === 4
            ? POINTS.TETRIS
            : 0;

  return (level + 1) * lineClearPoints;
};
