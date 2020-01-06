import React from 'react';
import Board from './Board';
import GameInformation from './GameInformation';

import './app.scss';

export const App = () => {


  return (
    <div className="app">
      <Board />
      <GameInformation information={{ score: 0, level: 0, lines: 0 }} />
    </div>
  );
};

export default App;
