import { IPiece } from './piece';

export const rotate = (piece: IPiece): IPiece => {
    let p: IPiece = JSON.parse(JSON.stringify(piece));
    for (let y = 0; y < p.shape.length; ++y) {
        for (let x = 0; x < y; ++x) {
            [p.shape[x][y], p.shape[y][x]] = [p.shape[y][x], p.shape[x][y]];
        }
    }
    p.shape = p.shape.map(row => row.reverse());
    return p;
}