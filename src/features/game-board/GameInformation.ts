import { getLinesClearedPoints } from './points';

export class GameInformation {
  constructor(
    private score: number,
    private level: number,
    private lines: number
  ) {}

  current() {
    return {
      score: this.score,
      level: this.level,
      lines: this.lines,
    };
  }

  calculate(clearedLines: number): void {
    this.score = getLinesClearedPoints(clearedLines, this.level);
  }

  static create(): GameInformation {
    return new GameInformation(0, 0, 0);
  }
}
