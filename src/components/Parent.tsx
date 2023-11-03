import { useEffect, useRef, useState } from "react";

import { GameEngine } from "../game-engine";

import Board from "./Board";
import Header from "./Header";
import PlayerCard from "./PlayerCard";

import { GameData } from "../interfaces/game-data";
import { PieceColor } from "../interfaces/piece-color";

const defaultPlayers = {
  player1: {
    name: "PussyDestoryer69",
    image: "bg-player1",
    pieceColor: PieceColor.WHITE,
  },
  player2: {
    name: "FartLord1337",
    image: "bg-player2",
    pieceColor: PieceColor.BLACK,
  },
};

export const Parent = () => {
  const [parentSize, setParentSize] = useState({ height: 0, width: 0 });
  const parentRef = useRef<HTMLDivElement>(null);

  const gameEngine = GameEngine.instance;

  const [gameData, setGameData] = useState<GameData>({
    ...defaultPlayers,
    gameState: gameEngine.gameState,
  });

  const handleResize = () => {
    const element = parentRef.current;
    if (element) {
      const size = element?.getBoundingClientRect();
      setParentSize({ height: size.height, width: size.width });
    }
  };

  useEffect(() => {
    const element = parentRef.current;
    if (element) {
      const size = element?.getBoundingClientRect();
      setParentSize({ height: size.height, width: size.width });
    }
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div
      id="parent"
      ref={parentRef}
      className="h-full w-full flex flex-col justify-center items-center"
    >
      <Header
        parentRef={parentRef}
        height={parentSize.height}
        width={parentSize.width}
      />
      <div className="inline-block  bg-emerald-200 border-2 border-t-0 border-black shadow-custom md:pl-6 md:pr-6">
        <PlayerCard
          player={gameData.player2}
          enemyColor={gameData.player1.pieceColor}
          height={parentSize.height}
          width={parentSize.width}
          parentRef={parentRef}
          top={true}
        />
        <Board
          gameData={gameData}
          setGameData={setGameData}
          height={parentSize.height}
          width={parentSize.width}
          parentRef={parentRef}
        />
        <PlayerCard
          player={gameData.player1}
          enemyColor={gameData.player2.pieceColor}
          height={parentSize.height}
          width={parentSize.width}
          parentRef={parentRef}
        />
      </div>
    </div>
  );
};
