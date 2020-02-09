import React, { useState } from 'react';
import Board from './Board';
import { GameInformation } from './GameInformation';

import './app.scss';

export const App = () => {

  const [info, setInfo] = useState({ score: 0, level: 0, lines: 0 });

  const handleGameInformation = (inf) => {
    setInfo({ ...inf })
  };

  return (
    <div className="app">
      <Board onGameInformation={handleGameInformation} />
      <GameInformation className="c-game-information" information={info} />
    </div>
  );
};

export default App;
