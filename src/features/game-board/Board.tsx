import { useEffect, useRef, MutableRefObject, useState } from 'react';
import {
  useGameLoop,
  useKeyboard,
  GameInformationType,
  rotate,
} from '../../common';
import { LEVEL, COLUMNS, ROWS } from './config';
import { Piece } from '../game-piece';
import { getLinesClearedPoints, POINTS } from './points';
import { GameRenderer } from '../game-renderer';
import { BoardManager } from './BoardManager';

interface BoardProps {
  onGameInformation: (information: GameInformationType) => void;
  renderer: GameRenderer;
  ctx: CanvasRenderingContext2D;
}

export const Board = ({ renderer, ctx, onGameInformation }: BoardProps) => {
  const [isGameStarted, setGameStarted] = useState<boolean>(false);
  const counters = useRef({ lines: 0 });
  const gameInformation = useRef<GameInformationType>({
    score: 0,
    level: 0,
    lines: 0,
  });
  const board = useRef(BoardManager.createEmpty(COLUMNS, ROWS));
  const time = useRef({ start: 0, elapsed: 0, level: LEVEL.timeForLevel(0) });
  const piece = useRef<Piece>(null);
  const escapeKey = useKeyboard('Escape');
  const aKey = useKeyboard('a');
  const wKey = useKeyboard('w');
  const sKey = useKeyboard('s');
  const dKey = useKeyboard('d');
  const lKey = useKeyboard('l');

  const drop = (p: MutableRefObject<Piece>): boolean => {
    const newPiece = { ...p.current, y: p.current.y + 1 };
    if (board.current.isNotInCollision(newPiece)) {
      p.current.move(newPiece);
    } else {
      board.current.freeze(p.current);
      const clearedLines = board.current.clearLines();
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
      p.current = new Piece(ctx);
    }

    return true;
  };

  const resetState = () => {
    board.current.clear();
    time.current = { start: 0, elapsed: 0, level: LEVEL.timeForLevel(0) };
    gameInformation.current = { level: 0, score: 0, lines: 0 };
  };

  const handlePlay = () => {
    piece.current = new Piece(ctx);
    time.current.start = performance.now();
    resetState();
    setGameStarted(true);
    onGameInformation({ ...gameInformation.current });
  };

  const handleReset = () => {
    renderer.clear();
    resetState();
    setGameStarted(false);
    renderer.drawBoard(board.current.getBoard());
    renderer.gameOver();
  };

  useEffect(() => {
    renderer.drawBoard(board.current.getBoard());
    piece.current = null;
  }, []);

  useGameLoop(() => {
    if (isGameStarted) {
      renderer.clear();
      renderer.drawBoard(board.current.getBoard());
      if (piece.current !== null) {
        renderer.drawBlock(piece.current);
      }
    }
  }, [isGameStarted]);

  useGameLoop(
    (now) => {
      if (isGameStarted) {
        time.current.elapsed = now - time.current.start;
        if (time.current.elapsed > time.current.level) {
          time.current.start = now;
          if (!drop(piece)) {
            setGameStarted(false);
            renderer.gameOver();
            board.current.clear();
            time.current = {
              start: 0,
              elapsed: 0,
              level: LEVEL.timeForLevel(gameInformation.current.level),
            };
          }
        }
      }
    },
    [isGameStarted]
  );

  useEffect(() => {
    const block = piece.current;
    if (escapeKey) {
      renderer.gameOver();
      setGameStarted(false);
    } else if (block !== null && isGameStarted) {
      let p = lKey
        ? rotate(block)
        : {
            ...block,
            x: aKey ? block.x - 1 : dKey ? block.x + 1 : block.x,
            y: sKey || wKey ? block.y + 1 : block.y,
          };
      if (wKey) {
        while (board.current.isNotInCollision(p)) {
          gameInformation.current.score += POINTS.HARD_DROP;
          block.move(p);
          p = { ...block, y: block.y + 1 };
        }
      } else if (board.current.isNotInCollision(p)) {
        block.move(p);
        if (sKey) {
          gameInformation.current.score += POINTS.SOFT_DROP;
        }
      }
      renderer.clear();
      renderer.drawBoard(board.current.getBoard());
      renderer.drawBlock(block);
    }
  }, [isGameStarted, escapeKey, aKey, wKey, sKey, dKey, lKey]);

  return (
    <>
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
