import React, { FC } from 'react';
import { GameInformationType } from './types';

interface GameInformationProps {
  information: GameInformationType;
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
