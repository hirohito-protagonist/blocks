import React from 'react';
import Board from './Board';

import './app.scss';

export const App = () => {

  let board = React.useRef();

  const handlePLay = () => {
    console.log(board);
  };

  return (
    <div className="app">
      <Board />
    </div>
  );
};

export default App;
