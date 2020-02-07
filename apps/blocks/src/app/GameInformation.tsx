import React from 'react';

export default function GameInformation({ information, className }) {

  return (
    <div className={className}>
      <p>Score: {information.score}</p>
      <p>Lines: {information.lines}</p>
      <p>Level: {information.level}</p>
    </div>
  );
};
