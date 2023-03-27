import { useEffect, FC, useRef, MutableRefObject, useState } from 'react';
import { LEVEL } from './config';
import { Piece } from '../game-piece';
import { isNotInCollision } from '../../common/collision';
import { useGameLoop } from '../../common/hooks';
import { GameInformationType } from '../../common/types';
import { freeze, clearLines, createEmptyBoard } from './util';
import { moves, KEY } from './keyboard';
import { drawBoard, gameOver } from './render';
import { getLinesClearedPoints, POINTS } from './points';


interface BoardProps {
  onGameInformation: (information: GameInformationType) => void;
}

export const Board: FC<BoardProps> = ({ onGameInformation }) => {

  const [isGameStarted, setGameStarted] = useState<boolean>(false);
  const counters = useRef({ lines: 0 });
  const gameInformation = useRef<GameInformationType>({ score: 0, level: 0, lines: 0 });
  const grid = useRef(createEmptyBoard());
  const time = useRef({ start: 0, elapsed: 0, level: LEVEL[0] });
  const piece = useRef<Piece>();


  const canvasCntext = useRef<HTMLCanvasElement>(null);

  const getContext = (): CanvasRenderingContext2D => {
    const canvas: HTMLCanvasElement = canvasCntext.current as HTMLCanvasElement;
    return canvas.getContext('2d') as CanvasRenderingContext2D;
  };

  const drop = (p: MutableRefObject<Piece>): boolean => {
    const newPiece = moves[KEY.S](p.current);
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
      if (event.keyCode === KEY.W) {
        while (isNotInCollision(p, grid.current)) {
          gameInformation.current.score += POINTS.HARD_DROP;
          piece.current.move(p);
          p = moves[KEY.S](piece.current);
        }
      }
      else if (isNotInCollision(p, grid.current)) {
        piece.current.move(p);
        if (event.keyCode === KEY.S) {
          gameInformation.current.score += POINTS.SOFT_DROP;
        }
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
