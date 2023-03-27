import { useState } from 'react';
import { Board } from '../features/game-board';
import { GameInformation } from '../features/game-information';

import './app.module.scss';

export const App = () => {

  const [info, setInfo] = useState({ score: 0, level: 0, lines: 0 });

  const handleGameInformation = (inf) => {
    setInfo({ ...inf });
  };

  return (
    <div className="app">
      <Board onGameInformation={handleGameInformation} />
      <GameInformation className="c-game-information" information={info} />
    </div>
  );
};

export default App;
