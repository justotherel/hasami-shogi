import { PieceColor } from "../interfaces/piece-color";
import { Player } from "../interfaces/player";

interface Props {
  player: Player;
  enemyColor: PieceColor;
}

const PlayerCard = (props: Props) => {
  const { player, enemyColor } = props;

  const captures = [];

  if (player && player.captured) {
    for (let i = 0; i < player.captured; i++) {
      captures.push(
        <div
          key={i}
          className={`h-6 -ml-3 md:h-8 md:-ml-4 rounded-full aspect-square border border-black md:border-2 ${enemyColor}`}
        ></div>
      );
    }

    captures.push(
      <div key={'advantage'} className={`ml-1`}>
        {player && !!player.advantage && `+${player.advantage}`}
      </div>
    );
  }

  return (
    <div className="w-fill border-l-2 border-r-2 border-black flex font-mono text-lg p-2 pb-3 md:pl-6">
      <div
        className={`${player.image} h-16 aspect-square bg-contain border-4 border-red-500 shadow-button-hover`}
      ></div>
      <div>
        <p className="pl-3 md:pl-4">{player.name}</p>
        <div className="pl-6 md:pl-8 flex items-center">{captures}</div>
      </div>
    </div>
  );
};

export default PlayerCard;
