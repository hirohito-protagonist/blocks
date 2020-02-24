import { PieceType } from '../../common/types';
import { rotate } from '../../common/rotate';
import { KEY } from '../../common/constants';

export const moves = {
  [KEY.A]: (p: PieceType): PieceType => ({ ...p, x: p.x - 1 }),
  [KEY.D]: (p: PieceType): PieceType => ({ ...p, x: p.x + 1 }),
  [KEY.S]: (p: PieceType): PieceType => ({ ...p, y: p.y + 1 }),
  [KEY.W]: (p: PieceType): PieceType => ({ ...p, y: p.y + 1 }),
  [KEY.L]: (p: PieceType): PieceType => rotate(p)
};
