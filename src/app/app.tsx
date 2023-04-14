import { useState } from 'react';
import { GameBoard } from '../features/game-board';
import { GameInformation } from '../features/game-information';
import { GameInformationType } from '../common';
import './app.module.scss';

export const App = () => {

  const [info, setInfo] = useState<GameInformationType>({ score: 0, level: 0, lines: 0 });

  const handleGameInformation = (inf: GameInformationType) => {
    setInfo({ ...inf });
  };

  return (
    <div className="app">
      <GameBoard onGameInformation={handleGameInformation} />
      <GameInformation className="c-game-information" information={info} />
    </div>
  );
};
