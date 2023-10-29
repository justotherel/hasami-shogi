import { useRef, useState } from "react";

import { HORIZONTAL_AXIS, VERTICAL_AXIS } from "./constants";

import { PieceColor } from "./interfaces/piece-color";
import { Player } from "./interfaces/player";

import { Position } from "./game-engine/position";
import { ActvieSide, GameEngine, GameState } from "./game-engine";

import GameOverModal from "./components/GameOverModal";
import PlayerCard from "./components/PlayerCard";
import Tile from "./components/Tile";

interface Piece {
  position: Position;
  color?: PieceColor;
}

interface GameData {
  player1: Player;
  player2: Player;
  gameState: GameState;
}

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

const parseBoardState = (gameSate: GameState): Piece[] => {
  const pieces: Piece[] = [];
  gameSate.board.forEach((el, index) => {
    if (el !== 0) {
      pieces.push({
        position: Position.fromIndex(index),
        color: el === 1 ? PieceColor.WHITE : PieceColor.BLACK,
      });
    }
  });
  return pieces;
};

const App = () => {
  const gameEngine = GameEngine.instance;
  const boardRef = useRef<HTMLDivElement>(null);

  const [gameData, setGameData] = useState<GameData>({
    ...defaultPlayers,
    gameState: gameEngine.gameState,
  });
  const [grabPosition, setGrabPosition] = useState<Position>(
    new Position(-1, -1)
  );
  const [activePiece, setActivePiece] = useState<HTMLElement | null>(null);
  const [pieces, setPieces] = useState(parseBoardState(gameData.gameState));

  const board = [];

  for (let j = VERTICAL_AXIS.length - 1; j >= 0; j--) {
    for (let i = 0; i < HORIZONTAL_AXIS.length; i++) {
      const piece = pieces.find((p) => p.position.isEqual(new Position(i, j)));
      const pieceColor = piece ? piece.color : undefined;

      const currentPiece = activePiece
        ? pieces.find((p) => p.position.isEqual(grabPosition))
        : undefined;
      const highlight = currentPiece
        ? gameEngine.isValidMove(grabPosition, new Position(i, j))
        : undefined;

      board.push(
        <Tile
          key={`${i},${j}`}
          x={i}
          y={j}
          pieceColor={pieceColor}
          highlight={highlight}
        />
      );
    }
  }

  const grabPiece = (e: React.MouseEvent<HTMLDivElement>) => {
    const element = e.target as HTMLDivElement;
    const board = boardRef.current;
    const activeColor =
      gameData.gameState.actvieSide === ActvieSide.WHITE_TO_MOVE
        ? PieceColor.WHITE
        : PieceColor.BLACK;
    if (
      element.classList.contains("piece") &&
      element.classList.contains(activeColor) &&
      board
    ) {
      const tileSize = element.parentElement!.offsetHeight;
      const boardHeight = tileSize * VERTICAL_AXIS.length;
      const currentX = Math.floor((e.clientX - board.offsetLeft) / tileSize);
      const currentY = Math.abs(
        Math.ceil((e.clientY - board.offsetTop - boardHeight) / tileSize)
      );

      setGrabPosition(new Position(currentX, currentY));

      const size = element.offsetHeight;
      const x = e.clientX - size * 0.5;
      const y = e.clientY - size * 0.5;

      element.style.position = "absolute";
      element.style.left = `${x}px`;
      element.style.top = `${y}px`;
      element.style.height = `${size}px`;

      setActivePiece(element);
    }
  };

  const movePiece = (e: React.MouseEvent<HTMLDivElement>) => {
    const board = boardRef.current;
    if (activePiece && board) {
      const size = activePiece.offsetHeight;

      const minX = board.offsetLeft;
      const minY = board.offsetTop;

      const maxX = board.offsetLeft + board.clientWidth - size * 0.75;
      const maxY = board.offsetTop + board.clientHeight - size * 0.75;

      const x = e.clientX - size * 0.5;
      const y = e.clientY - size * 0.5;

      activePiece.style.position = "absolute";
      activePiece.style.left = `${x > maxX ? maxX : Math.max(minX, x)}px`;
      activePiece.style.top = `${y > maxY ? maxY : Math.max(minY, y)}px`;
      activePiece.style.height = `${size}px`;
    }
  };

  const dropPiece = (e: React.MouseEvent<HTMLDivElement>) => {
    const board = boardRef.current;
    const element = e.target as HTMLDivElement;

    if (activePiece && board) {
      const tileSize = element.parentElement!.offsetHeight;
      const boardHeight = tileSize * VERTICAL_AXIS.length;

      const newX = Math.floor((e.clientX - board.offsetLeft) / tileSize);
      const newY = Math.abs(
        Math.ceil((e.clientY - board.offsetTop - boardHeight) / tileSize)
      );

      const newGameState = gameEngine.playMove(
        grabPosition,
        new Position(newX, newY)
      );

      if (newGameState) {
        setGameData((previous) => {
          const newGameData = { ...previous };
          const advantage =
            newGameState.whiteCaptured - newGameState.blackCaptured;

          if (advantage > 0) {
            newGameData.player1.advantage = advantage;
          } else if (advantage < 0) {
            newGameData.player2.advantage = Math.abs(advantage);
          } else {
            newGameData.player1.advantage = 0;
            newGameData.player2.advantage = 0;
          }

          newGameData.player1.captured = newGameState.whiteCaptured;
          newGameData.player2.captured = newGameState.blackCaptured;

          return { ...previous, gameState: newGameState };
        });
        setPieces(() => parseBoardState(gameData.gameState));
      }

      activePiece.style.position = "relative";
      activePiece.style.removeProperty("top");
      activePiece.style.removeProperty("left");

      setActivePiece(null);
    }
  };

  const restartGame = () => {
    gameEngine.restart();
    setGameData((previous) => {
      const newGameData = { ...previous };
      newGameData.gameState = gameEngine.gameState;
      return newGameData;
    });
    setPieces(() => parseBoardState(gameData.gameState));
  };

  return (
    <>
      <div className="flex justify-center h-screen items-center bg-orange-100 subpixel-antialiased">
        <div className="w-2/3 2xl:w-1/2 lg:max-w-4xl shadow-custom bg-emerald-200 rounded-t-lg border-b-2 border-black">
          <header className="border-2 border-black h-full p-2 pl-6 bg-red-300 rounded-t-lg font-mono text-2xl">
            HASAMI SHOGI
          </header>
          <PlayerCard
            player={gameData.player2}
            enemyColor={gameData.player1.pieceColor}
          />
          <div className="text-center border-black border-2 border-t-0 border-b-0 pl-6 pr-6">
            {gameData.gameState.isGameOver && (
              <GameOverModal
                loser={gameData.gameState.actvieSide === ActvieSide.WHITE_TO_MOVE ? gameData.player2 : gameData.player1}
                winner={gameData.gameState.actvieSide === ActvieSide.WHITE_TO_MOVE ? gameData.player1 : gameData.player2}
                handleMouseClick={() => restartGame()}
              />
            )}
            <div
              id="board"
              ref={boardRef}
              className="grid grid-cols-8 border-black border-8 box-content"
              onMouseDown={(e) => grabPiece(e)}
              onMouseMove={(e) => movePiece(e)}
              onMouseUp={(e) => dropPiece(e)}
            >
              {board}
            </div>
          </div>
          <PlayerCard
            player={gameData.player1}
            enemyColor={gameData.player2.pieceColor}
          />
        </div>
      </div>
    </>
  );
};

export default App;
