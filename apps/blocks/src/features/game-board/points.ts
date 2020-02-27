import { POINTS } from '../../common/constants';

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
