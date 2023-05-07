import { useEffect, useRef, MutableRefObject, useState } from 'react';
import {
  useGameLoop,
  useKeyboard,
  GameInformationType,
} from '../../common';
import { LEVEL, COLUMNS, ROWS } from './config';
import { BlockRecord } from '../game-piece';
import { getLinesClearedPoints, POINTS } from './points';
import { GameRenderer } from '../game-renderer';
import { BoardManager } from './BoardManager';
import { GameInformation } from './GameInformation';

interface BoardProps {
  onGameInformation: (information: GameInformationType) => void;
  renderer: GameRenderer;
}

export const Board = ({ renderer, onGameInformation }: BoardProps) => {
  const [isGameStarted, setGameStarted] = useState<boolean>(false);
  const counters = useRef({ lines: 0 });
  const gameInformation = useRef<GameInformation>(GameInformation.create());
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
        const { level } = gameInformation.current.current();
        const points = getLinesClearedPoints(
          clearedLines,
          level,
        );
        gameInformation.current.calculate(clearedLines);
        counters.current.lines += clearedLines;
      }

      const gameInfo = gameInformation.current.current();
      time.current.level = LEVEL.timeForLevel(gameInfo.level);
      onGameInformation(gameInfo);
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
    gameInformation.current.clear();
  };

  const handlePlay = () => {
    blockRecord.current = BlockRecord.withRandomShape();
    time.current.start = performance.now();
    resetState();
    setGameStarted(true);
    onGameInformation(gameInformation.current.current());
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
            const { level } = gameInformation.current.current();
            setGameStarted(false);
            renderer.gameOver();
            board.current.clear();

            time.current = {
              start: 0,
              elapsed: 0,
              level: LEVEL.timeForLevel(level),
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
          gameInformation.current.addScore(POINTS.HARD_DROP);
          blockRecord.current = newBlock;
          newBlock = newBlock.moveDown();
        }
      } else if (board.current.isNotInCollision(newBlock)) {
        blockRecord.current = newBlock;
        if (sKey) {
          gameInformation.current.addScore(POINTS.SOFT_DROP);
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
