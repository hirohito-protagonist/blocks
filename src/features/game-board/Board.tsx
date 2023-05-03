import { useEffect, useRef, MutableRefObject, useState } from 'react';
import {
  useGameLoop,
  useKeyboard,
  GameInformationType,
  rotate,
} from '../../common';
import { LEVEL, COLUMNS, ROWS } from './config';
import { BlockRecord } from '../game-piece';
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
  const blockRecord = useRef(BlockRecord.withRandomShape())
  const escapeKey = useKeyboard('Escape');
  const aKey = useKeyboard('a');
  const wKey = useKeyboard('w');
  const sKey = useKeyboard('s');
  const dKey = useKeyboard('d');
  const lKey = useKeyboard('l');

  const drop = (p: MutableRefObject<BlockRecord>): boolean => {
    const newPiece = p.current.moveDown();
    if (board.current.isNotInCollision(newPiece)) {
      p.current = newPiece;
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
      p.current = BlockRecord.withRandomShape();
    }

    return true;
  };

  const resetState = () => {
    board.current.clear();
    time.current = { start: 0, elapsed: 0, level: LEVEL.timeForLevel(0) };
    gameInformation.current = { level: 0, score: 0, lines: 0 };
  };

  const handlePlay = () => {
    blockRecord.current = BlockRecord.withRandomShape();
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
    blockRecord.current = BlockRecord.withRandomShape();
  }, []);

  useGameLoop(
    (now) => {
      if (isGameStarted) {
        time.current.elapsed = now - time.current.start;
        if (time.current.elapsed > time.current.level) {
          time.current.start = now;
          if (!drop(blockRecord)) {
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
    const currentBlock = blockRecord.current;
    if (escapeKey) {
      renderer.gameOver();
      setGameStarted(false);
    } else if (isGameStarted) {
      let newBlock = currentBlock;
      if (lKey) {
        newBlock = currentBlock.rotate();
      } else if (aKey) {
        newBlock = currentBlock.moveLeft();
      } else if (dKey) {
        newBlock = currentBlock.moveRight();
      } else if (sKey || wKey) {
        newBlock = currentBlock.moveDown();
      }
      if (wKey) {
        while (board.current.isNotInCollision(newBlock)) {
          gameInformation.current.score += POINTS.HARD_DROP;
          blockRecord.current = newBlock;
          newBlock = newBlock.moveDown();
        }
      } else if (board.current.isNotInCollision(newBlock)) {
        blockRecord.current = newBlock;
        if (sKey) {
          gameInformation.current.score += POINTS.SOFT_DROP;
        }
      }
    }
  }, [isGameStarted, escapeKey, aKey, wKey, sKey, dKey, lKey]);

  useGameLoop(() => {
    if (isGameStarted) {
      renderer.clear();
      renderer.drawBoard(board.current.getBoard());
      renderer.drawBlock(blockRecord.current);
    }
  }, [isGameStarted]);
  
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
