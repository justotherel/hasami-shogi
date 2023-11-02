import React, { useEffect, useRef, useState } from "react";
import Board from "./Board";
import { Player } from "../interfaces/player";
import { PieceColor } from "../interfaces/piece-color";
import { GameEngine } from "../game-engine";
import { GameData } from "../interfaces/game-data";

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

const Parent = () => {
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
      <div className="inline-block  bg-emerald-200 pl-3 pr-3 border-2 border-t-0 border-black shadow-custom">
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

const Header = (props: {
  width: number;
  height: number;

  parentRef: React.MutableRefObject<HTMLElement | null>;
  top?: boolean;
}) => {
  let { height, width } = props;
  const { parentRef } = props;

  const element = parentRef.current;
  if (element && height === 0 && width === 0) {
    const size = element?.getBoundingClientRect();
    height = size.height;
    width = size.width;
  }

  const minDim = Math.min(height - 252, width);

  return (
    <header
      className="border-2 w-full border-black bg-red-300 rounded-t-lg font-mono text-2xl shadow-custom pt-3 pb-3 box-content"
      style={{ width: minDim + 24 }}
    >
      <h1 className="pl-3">HASAMI SHOGI</h1>
    </header>
  );
};

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
      className={`bg-emerald-200 flex max-h-[100px] w-full items-top justify-start font-mono text-lg pt-3 pb-3`}
      style={{ width: minDim }}
    >
      <div
        className={` aspect-square h-16 bg-contain border-4 border-red-500 shadow-button-hover ${player.image} `}
      ></div>
      <div>
        <p className="pl-3">{player.name}</p>
        <div className="pl-6 md:pl-8 flex items-center">{captures}</div>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <div className="h-100dvh bg-orange-100">
      <div className="p-6 h-full">
        <Parent />
      </div>
    </div>
  );
};

export default App;
