export const COLUMNS = 10;
export const ROWS = 20;
export const BLOCK_SIZE = 30;
export class LEVEL {
  static readonly 0 = 800;
  static readonly 1 = 720;
  static readonly 2 = 630;
  static readonly 3 = 550;
  static readonly 4 = 470;
  static readonly 5 = 380;
  static readonly 6 = 300;
  static readonly 7 = 220;
  static readonly 8 = 130;
  static readonly 9 = 100;
  static readonly 10 = 80;
  static timeForLevel(level: number): number {
    switch (level) {
      case 1:
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
      case 8:
      case 9:
      case 10: {
        return LEVEL[level];
      }
      default:
        return LEVEL[0];
    }
  }
}
