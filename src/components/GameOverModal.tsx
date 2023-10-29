import { Player } from "../interfaces/player";

interface Props {
  winner: Player;
  loser: Player;
  handleMouseClick: () => void;
}

const GameOverModal = (props: Props) => {
  const { winner, loser, handleMouseClick } = props;

  return (
    <div className="game-over-modal-container font-bold">
      <div className="absolute w-full h-full left-0 top-0 flex justify-center items-center animate-slideUp">
        <div className="bg-orange-100 border-2 border-black rounded-t-lg flex flex-col justify-between shadow-button-hover w-80 h-72">
          <header className=" bg-red-300 border-black border-b-2 rounded-t-lg p-2 font-extrabold text-2xl text-white">
            <p className="animate-zoomInOut animation-delay-750 animation-fill-mode-both">
              {winner.name} Won
            </p>
          </header>
          <div className="grid grid-cols-3 pl-6 pr-6 items-center justify-center">
            <div className="font-mono truncate">
              <div
                className={`${winner.image} m-auto h-20 bg-no-repeat bg-contain border-black border-4 aspect-square`}
              ></div>
              {winner.name}
            </div>
            <div className="text-2xl text-black font-extrabold pb-4">VS</div>
            <div className="font-mono truncate items-center">
              <div
                className={`${loser.image} m-auto h-20 bg-contain border-black border-4 aspect-square`}
              ></div>
              {loser.name}
            </div>
          </div>
          <button 
           onClick={ () => handleMouseClick()}
          className="transition-all bg-amber-300 shadow-button border-2 border-black pt-4 pb-4 pl-14 pr-14 hover:shadow-button-hover hover:-translate-x-2 hover:-translate-y-2 active:shadow-button active:translate-x-0 active:translate-y-0 m-4 mb-3 mt-0">
            Play again
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameOverModal;
