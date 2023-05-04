import { getLinesClearedPoints } from './points';

export class GameInformation {
  private lineCounter = 0;
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
    this.lineCounter += clearedLines;
    if (this.lineCounter >= 5) {
      this.level = this.level < 10 ? this.level + 1 : this.level;
      this.lineCounter -= 5;
    }
    this.lines = clearedLines;
  }

  static create(): GameInformation {
    return new GameInformation(0, 0, 0);
  }
}
