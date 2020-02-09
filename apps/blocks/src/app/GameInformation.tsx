import React, { FC } from 'react';

interface GameInformationProps {
  information: {
    score: number;
    lines: number;
    level: number;
  };
  className: string;
}

export const GameInformation: FC<GameInformationProps> = ({ information, className }) => {

  return (
    <div className={className}>
      <p>Score: {information.score}</p>
      <p>Lines: {information.lines}</p>
      <p>Level: {information.level}</p>
    </div>
  );
};
