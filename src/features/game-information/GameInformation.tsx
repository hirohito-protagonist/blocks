import { GameInformationType } from '../../common/types';

interface GameInformationProps {
  information: GameInformationType;
  className: string;
}

export const GameInformation = ({ information, className }: GameInformationProps) => {

  return (
    <div className={className}>
      <p>Score: {information.score}</p>
      <p>Lines: {information.lines}</p>
      <p>Level: {information.level}</p>
    </div>
  );
};
