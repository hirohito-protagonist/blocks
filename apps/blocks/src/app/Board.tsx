import React, { useEffect, createRef, useRef, MutableRefObject, useState } from 'react';
import { COLUMNS, ROWS, BLOCK_SIZE, KEY, LEVEL, POINTS } from './constants';
import { Piece, IPiece } from './piece';
import { isNotInCollision } from './collision';
import { rotate } from './rotate';

const createEmptyBoard = () => Array.from({ length: ROWS }, () => Array(COLUMNS).fill(0));

const freeze = (p: MutableRefObject<Piece>, board: number[][]): number[][] => {
  const g = [...board];
  p.current.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value > 0) {
        g[y + p.current.y][x + p.current.x] = value;
      }
    });
  });
  return g;
};

const addOutlines = (ctx: CanvasRenderingContext2D) => {
  for (let i = 0; i < COLUMNS; i++) {
    ctx.fillStyle = '#511159';
    ctx.fillRect(i, 0, 0.025, ctx.canvas.height);
  }
  for (let i = 0; i < ROWS; i++) {
    ctx.fillStyle = '#511159';
    ctx.fillRect(0, i, ctx.canvas.width, 0.025);
  }
};

const clearLines = (board: number[][]): { board: number[][]; clearedLines: number; } => {

  let lines = 0;
  const g = [...board];
  g.forEach((row, y) => {
    if (row.every(value => value !== 0)) {
      lines++;
      g.splice(y, 1);
      g.unshift(Array(COLUMNS).fill(0));
    }
  });
  return {
    board: g,
    clearedLines: lines
  };
};

const drawBoard = (ctx: CanvasRenderingContext2D, board: number[][]): void => {
  ctx.canvas.width = COLUMNS * BLOCK_SIZE;
  ctx.canvas.height = ROWS * BLOCK_SIZE;
  ctx.scale(BLOCK_SIZE, BLOCK_SIZE);
  board.forEach((row: any[], y) => {
    row.forEach((value, x) => {
      if (value > 0) {
        ctx.fillStyle = '#711673';
        ctx.fillRect(x, y, 1, 1);
      }
    });
  });
  addOutlines(ctx);
};

const gameOver = (ctx: CanvasRenderingContext2D): void => {
  ctx.fillStyle = '#711673';
  ctx.fillRect(1, 3, 8, 1.2);
  ctx.font = '1px Arial';
  ctx.fillStyle = 'white';
  ctx.fillText('GAME OVER', 1.8, 4);
};

const useGameLoop = (callback, deps = []) => {

  const requestRef = useRef<number>();

  const animate = (time) => {
    callback(time);
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, deps);
};

const moves = {
  [KEY.A]: (p: IPiece): IPiece => ({ ...p, x: p.x - 1 }),
  [KEY.D]: (p: IPiece): IPiece => ({ ...p, x: p.x + 1 }),
  [KEY.S]: (p: IPiece): IPiece => ({ ...p, y: p.y + 1 }),
  [KEY.L]: (p: IPiece): IPiece => ({ ...p, y: p.y + 1 }),
  [KEY.W]: (p: IPiece): IPiece => rotate(p)
};

const getLinesClearedPoints = (lines: number, level: number): number => {
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

const Board = ({ onGameInformation }) => {

  const [isGameStarted, setGameStarted] = useState<boolean>(false);
  const counters = useRef({ lines: 0 });
  const gameInformation = useRef({ score: 0, level: 0, lines: 0 });
  const grid = useRef(createEmptyBoard());
  const time = useRef({ start: 0, elapsed: 0, level: LEVEL[0] });
  const piece = useRef<Piece>();


  const canvasCntext = useRef<HTMLCanvasElement>(null);

  const getContext = (): CanvasRenderingContext2D => {
    const canvas: HTMLCanvasElement = canvasCntext.current;
    return canvas.getContext('2d');
  };

  const drop = (p: MutableRefObject<Piece>): boolean => {
    let newPiece = moves[KEY.S](p.current);
    if (isNotInCollision(newPiece, grid.current)) {
      p.current.move(newPiece);
    } else {
      const { board, clearedLines } = clearLines(freeze(p, grid.current));
      grid.current = board;
      if (clearedLines > 0) {

        const points = getLinesClearedPoints(clearedLines, gameInformation.current.level);
        counters.current.lines += clearedLines;
        if (counters.current.lines >= 5) {
          const lvl = gameInformation.current.level < 10 ? gameInformation.current.level + 1 : gameInformation.current.level;
          counters.current.lines -= 5;
          time.current.level = LEVEL[lvl];
          gameInformation.current.level = lvl;
        }
        gameInformation.current.lines += clearedLines;
        gameInformation.current.score += points;
      }

      onGameInformation({ ...gameInformation.current });
      if (p.current.y === 0) {
        return false;
      }
      p.current = new Piece(getContext());
    }

    return true;
  };

  const resetState = () => {
    grid.current = createEmptyBoard();
    time.current = { start: 0, elapsed: 0, level: LEVEL[0] };
    gameInformation.current = { level: 0, score: 0, lines: 0 };
  };

  const handlePlay = () => {
    const ctx = getContext();
    piece.current = new Piece(ctx);
    time.current.start = performance.now();
    resetState();
    setGameStarted(true);
    onGameInformation({ ...gameInformation.current });
  };

  const handleReset = () => {
    const ctx = getContext();
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    resetState();
    setGameStarted(false);
    drawBoard(ctx, grid.current);
    gameOver(ctx);
  };

  const keyEvent = (event: KeyboardEvent) => {
    const ctx = getContext();
    if (event.keyCode === KEY.ESC) {
      gameOver(ctx);
      setGameStarted(false);
    } else if (moves[event.keyCode]) {
      let p = moves[event.keyCode](piece.current);
      if (event.keyCode === KEY.L) {
        while (isNotInCollision(p, grid.current)) {
          piece.current.move(p);
          p = moves[KEY.S](piece.current);
        }
      }
      else if (isNotInCollision(p, grid.current)) {
        piece.current.move(p);
      }
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      drawBoard(ctx, grid.current);
      piece.current.draw();
    }
  };

  useEffect(() => {
    const ctx = getContext();
    drawBoard(ctx, grid.current);
    piece.current = null;
  }, []);

  useEffect(() => {

    document.addEventListener('keydown', keyEvent);
    return () => {
      document.removeEventListener('keydown', keyEvent);
    };
  }, [isGameStarted]);

  useGameLoop((now) => {
    if (isGameStarted) {
      const ctx = getContext();
      time.current.elapsed = now - time.current.start;
      if (time.current.elapsed > time.current.level) {
        time.current.start = now;
        if (!drop(piece)) {
          setGameStarted(false);
          gameOver(ctx);
          grid.current = createEmptyBoard();
          time.current = { start: 0, elapsed: 0, level: LEVEL[gameInformation.current.level] };
          return;
        }
      }
      drawBoard(ctx, grid.current);
      piece.current.draw();
    }

  }, [isGameStarted]);

  return (
    <>
      <canvas ref={canvasCntext} className="c-game-board"></canvas>
      {isGameStarted ? (
        <button onClick={handleReset} onKeyDown={(e) => e.preventDefault()}>Reset</button>
      ) : (
          <button onClick={handlePlay} onKeyDown={(e) => e.preventDefault()}>Play</button>
        )}
    </>
  );
};

export default Board;
