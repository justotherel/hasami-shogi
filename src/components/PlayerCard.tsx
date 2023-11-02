import { PieceColor } from "../interfaces/piece-color";
import { Player } from "../interfaces/player";

interface Props {
  player: Player;
  enemyColor: PieceColor;
  length: number;
  top?: boolean;
}

const PlayerCard = (props: Props) => {
  const { player, enemyColor, length, top} = props;

  const captures = [];
  const padding = top ? 'pt-2 pb-2' : 'pb-3 border-b-2'

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
      <div key="advantage" className="ml-1">
        {player && !!player.advantage && `+${player.advantage}`}
      </div>
    );
  }

  return (
    <div
      className={`border-l-2 border-r-2 border-black flex items-top justify-start font-mono text-lg pl-2 md:pl-6 ${padding} bg-emerald-200`}
      style={{ width: length }}
    >
      <div
        className={`${player.image} h-12 md:h-16 max-h-full aspect-square bg-contain border-4 border-red-500 shadow-button-hover`}
      ></div>
      <div>
        <p className="pl-3 md:pl-4">{player.name}</p>
        <div className="pl-6 md:pl-8 flex items-center">{captures}</div>
      </div>
    </div>
  );
};

export default PlayerCard;
