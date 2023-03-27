import { GameInformationType } from '../../common';

export const GameInformation = ({ information, className }: {
  information: GameInformationType;
  className: string;
}) => {

  return (
    <div className={className}>
      <p>Score: {information.score}</p>
      <p>Lines: {information.lines}</p>
      <p>Level: {information.level}</p>
    </div>
  );
};
