import { Winner } from "../game-engine/winner";
import { Player } from "../interfaces/player";

interface Props {
  winner?: Winner;
  player1: Player;
  player2: Player;
  handleMouseClick: () => void;
}

const GameOverModal = (props: Props) => {
  const { winner, player1, player2, handleMouseClick } = props;

  const headerText =
    winner === Winner.white_won
      ? `${player1.name} Won`
      : winner === Winner.draw
      ? "Draw"
      : `${player2.name} Won`;

  return (
    <div className="game-over-modal-container font-bold">
      <div className="absolute w-full h-full left-0 top-0 flex justify-center items-center animate-slideUp">
        <div className="bg-orange-100 border-2 border-black rounded-t-lg flex flex-col justify-between shadow-button-hover w-72 h-auto">
          <header className=" bg-red-300 border-black border-b-2 rounded-t-lg p-2 font-extrabold text-xl lg:text-2xl text-white">
            <p className="animate-zoomInOut animation-delay-750 animation-fill-mode-both">
              {headerText}
            </p>
          </header>
          <div className="p-4">
            <div className="grid grid-cols-3 items-center justify-center">
              <div className="font-mono truncate">
                <div
                  className={`${player1.image} m-auto h-20 bg-no-repeat bg-contain border-black border-4 aspect-square`}
                ></div>
                {player1.name}
              </div>
              <div className="text-2xl text-black font-extrabold pb-4">VS</div>
              <div className="font-mono truncate items-center">
                <div
                  className={`${player2.image} m-auto h-20 bg-contain border-black border-4 aspect-square`}
                ></div>
                {player2.name}
              </div>
            </div>
            <button
              onClick={() => handleMouseClick()}
              className="transition-all w-full mt-3 p-2 bg-amber-300 shadow-button border-2 border-black hover:shadow-button-hover hover:-translate-x-2 hover:-translate-y-2 active:shadow-button active:translate-x-0 active:translate-y-0"
            >
              Play again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameOverModal;
