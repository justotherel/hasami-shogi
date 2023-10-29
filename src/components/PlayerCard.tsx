import { PieceColor } from "../game-engine";
import { Player } from "../interfaces/player";

interface Props {
  player: Player;
  enemyColor: PieceColor;
}

const left = [
  "left-4",
  "left-8",
  "left-12",
  "left-16",
  "left-20",
  "left-24",
  "left-28",
  "left-32",
  "left-36",
  "left-40",
  "left-44",
  "left-48",
  "left-52",
  "left-56",
  "left-60",
  "left-64",
  "left-68",
  "left-72",
  "left-76",
  "left-80",
  "left-84",
  "left-88",
  "left-92",
  "left-96",
];

const PlayerCard = (props: Props) => {
  const { player, enemyColor } = props;

  const captures = [];

  if (player && player.captured) {
    for (let i = 0; i < player.captured; i++) {
      captures.push(
        <div
          key={left[i]}
          className={`absolute ${left[i]} rounded-full h-8 aspect-square border-2 border-black ${enemyColor}`}
        ></div>
      );
    }

    const advantageLeft = left[player.captured];
    captures.push(
      <div key={advantageLeft} className={`absolute ${advantageLeft} pl-5`}>
        {player && !!player.advantage && `+${player.advantage}`}
      </div>
    );
  }

  return (
    <div className="w-fill border-l-2 border-r-2 border-black flex font-mono text-lg pl-6 pb-3 pt-2">
      <div
        className={`${player.image} h-16 aspect-square bg-contain border-4 border-red-500 shadow-button-hover`}
      ></div>
      <div>
        <p className="pl-4">{player.name}</p>
        <div className="pl-4 relative">{captures}</div>
      </div>
    </div>
  );
};

export default PlayerCard;
