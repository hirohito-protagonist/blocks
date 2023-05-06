import { GameCanvasRenderer } from '../game-renderer';
import { GameInformationType } from '../../common';
import { BLOCK_SIZE, COLUMNS, ROWS } from './config';
import { Board } from './Board';

type GameBoardProps = {
  onGameInformation: (information: GameInformationType) => void;
};

export const GameBoard = ({ onGameInformation }: GameBoardProps) => {
  return (
    <GameCanvasRenderer
      width={COLUMNS * BLOCK_SIZE}
      height={ROWS * BLOCK_SIZE}
      blockSize={BLOCK_SIZE}
      initialized={(renderer) => {
        return (
          <Board
            renderer={renderer}
            onGameInformation={onGameInformation}
          />
        );
      }}
    />
  );
};
