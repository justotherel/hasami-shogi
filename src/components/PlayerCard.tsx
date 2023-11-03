import { PieceColor } from "../interfaces/piece-color";
import { Player } from "../interfaces/player";

const PlayerCard = (props: {
  player: Player;
  width: number;
  height: number;
  enemyColor: PieceColor;
  parentRef: React.MutableRefObject<HTMLElement | null>;
  top?: boolean;
}) => {
  let { height, width } = props;
  const { parentRef, player, enemyColor } = props;

  const element = parentRef.current;
  if (element && height === 0 && width === 0) {
    const size = element?.getBoundingClientRect();
    height = size.height;
    width = size.width;
  }

  const minDim = Math.min(height - 252, width);
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
      <div key="advantage" className="ml-1">
        {player && !!player.advantage && `+${player.advantage}`}
      </div>
    );
  }

  return (
    <div
      className={`bg-emerald-200 flex max-h-[100px] w-full items-top justify-start font-mono text-lg pt-2 pb-3`}
      style={{ width: minDim }}
    >
      <div
        className={`ml-2 md:ml-0 aspect-square h-16 bg-contain border-4 border-red-500 shadow-button-hover ${player.image} `}
      ></div>
      <div>
        <p className="pl-3">{player.name}</p>
        <div className="pl-6 md:pl-8 flex items-center">{captures}</div>
      </div>
    </div>
  );
};

export default PlayerCard;
