import { useEffect, FC, useRef, MutableRefObject, useState } from 'react';
import {
  isNotInCollision,
  useGameLoop,
  useKeyboard,
  GameInformationType,
  rotate,
} from '../../common';
import { BLOCK_SIZE, LEVEL, COLUMNS, ROWS } from './config';
import { Piece, pieceRender } from '../game-piece';
import { freeze, clearLines, createEmptyBoard } from './util';
import { getLinesClearedPoints, POINTS } from './points';
import { GameRenderer } from '../game-renderer';

interface BoardProps {
  onGameInformation: (information: GameInformationType) => void;
}

export const Board: FC<BoardProps> = ({ onGameInformation }) => {
  const [isGameStarted, setGameStarted] = useState<boolean>(false);
  const counters = useRef({ lines: 0 });
  const gameInformation = useRef<GameInformationType>({
    score: 0,
    level: 0,
    lines: 0,
  });
  const grid = useRef(createEmptyBoard());
  const time = useRef({ start: 0, elapsed: 0, level: LEVEL.timeForLevel(0) });
  const piece = useRef<Piece>(null);
  const escapeKey = useKeyboard('Escape');
  const aKey = useKeyboard('a');
  const wKey = useKeyboard('w');
  const sKey = useKeyboard('s');
  const dKey = useKeyboard('d');
  const lKey = useKeyboard('l');

  const canvasCntext = useRef<HTMLCanvasElement>(null);
  const renderer = useRef<GameRenderer>(null);

  const getContext = (): CanvasRenderingContext2D => {
    const canvas: HTMLCanvasElement = canvasCntext.current as HTMLCanvasElement;
    return canvas.getContext('2d') as CanvasRenderingContext2D;
  };

  const drop = (p: MutableRefObject<Piece>): boolean => {
    const newPiece = { ...p.current, y: p.current.y + 1 };
    if (isNotInCollision(newPiece, grid.current)) {
      p.current.move(newPiece);
    } else {
      const { board, clearedLines } = clearLines(freeze(p.current, grid.current));
      grid.current = board;
      if (clearedLines > 0) {
        const points = getLinesClearedPoints(
          clearedLines,
          gameInformation.current.level
        );
        counters.current.lines += clearedLines;
        if (counters.current.lines >= 5) {
          const lvl =
            gameInformation.current.level < 10
              ? gameInformation.current.level + 1
              : gameInformation.current.level;
          counters.current.lines -= 5;
          time.current.level = LEVEL.timeForLevel(lvl);
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
    time.current = { start: 0, elapsed: 0, level: LEVEL.timeForLevel(0) };
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
    renderer.current.drawBoard(grid.current);
    renderer.current.gameOver();
  };

  useEffect(() => {
    if (canvasCntext.current !== null && renderer.current === null) {
      renderer.current = GameRenderer.forCanvas(getContext(), {
        width: COLUMNS * BLOCK_SIZE,
        height: ROWS * BLOCK_SIZE,
        blockSize: BLOCK_SIZE,
      });
    }
  }, [canvasCntext.current, renderer.current]);

  useEffect(() => {
    renderer.current.drawBoard(grid.current);
    piece.current = null;
  }, []);

  useGameLoop(
    () => {
      if (isGameStarted) {
        const ctx = getContext();
        renderer.current.drawBoard(grid.current);
        if (piece.current !== null) {
          pieceRender(piece.current, ctx);
        }
      }
    },
    [isGameStarted]
  );

  useGameLoop((now) => {
    if (isGameStarted) {
      const ctx = getContext();
      time.current.elapsed = now - time.current.start;
      if (time.current.elapsed > time.current.level) {
        time.current.start = now;
        if (!drop(piece)) {
          setGameStarted(false);
          renderer.current.gameOver();
          grid.current = createEmptyBoard();
          time.current = {
            start: 0,
            elapsed: 0,
            level: LEVEL.timeForLevel(gameInformation.current.level),
          };
        }
      }
    }
  }, [isGameStarted]);

  useEffect(() => {
    const ctx = getContext();
    const block = piece.current;
    if (escapeKey) {
      renderer.current.gameOver();
      setGameStarted(false);
    } else if (block !== null) {
      let p = lKey
        ? rotate(block)
        : {
            ...block,
            x: aKey
              ? block.x - 1
              : dKey
              ? block.x + 1
              : block.x,
            y: sKey || wKey ? block.y + 1 : block.y,
          };
      if (wKey) {
        while (isNotInCollision(p, grid.current)) {
          gameInformation.current.score += POINTS.HARD_DROP;
          block.move(p);
          p = { ...block, y: block.y + 1 };
        }
      } else if (isNotInCollision(p, grid.current)) {
        block.move(p);
        if (sKey) {
          gameInformation.current.score += POINTS.SOFT_DROP;
        }
      }
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      renderer.current.drawBoard(grid.current);
      pieceRender(block, ctx);
    }
  }, [escapeKey, aKey, wKey, sKey, dKey, lKey]);

  return (
    <>
      <canvas ref={canvasCntext} className="c-game-board"></canvas>
      {isGameStarted ? (
        <button onClick={handleReset} onKeyDown={(e) => e.preventDefault()}>
          Reset
        </button>
      ) : (
        <button onClick={handlePlay} onKeyDown={(e) => e.preventDefault()}>
          Play
        </button>
      )}
    </>
  );
};
