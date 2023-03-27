import { PieceType } from '../../common/types';
import { rotate } from '../../common/rotate';

export class KEY {
  static readonly A = 65;
  static readonly D = 68;
  static readonly S = 83;
  static readonly W = 87;
  static readonly L = 76;
  static readonly ESC = 27;
}

export const moves = {
  [KEY.A]: (p: PieceType): PieceType => ({ ...p, x: p.x - 1 }),
  [KEY.D]: (p: PieceType): PieceType => ({ ...p, x: p.x + 1 }),
  [KEY.S]: (p: PieceType): PieceType => ({ ...p, y: p.y + 1 }),
  [KEY.W]: (p: PieceType): PieceType => ({ ...p, y: p.y + 1 }),
  [KEY.L]: (p: PieceType): PieceType => rotate(p)
};
