import React, { useRef, useState } from "react";

import { HORIZONTAL_AXIS, VERTICAL_AXIS } from "../constants";

import { GameData } from "../interfaces/game-data";
import { PieceColor } from "../interfaces/piece-color";

import { ActvieSide } from "../game-engine/active-side";
import { GameEngine } from "../game-engine";
import { GameState } from "../game-engine/game-state";
import { Position } from "../game-engine/position";

import GameOverModal from "./GameOverModal";
import Tile from "./Tile";

interface Props {
  gameData: GameData;
  setGameData: React.Dispatch<React.SetStateAction<GameData>>;
  height: number;
  width: number;
  parentRef: React.MutableRefObject<HTMLElement | null>;
}

interface Piece {
  position: Position;
  color?: PieceColor;
}

const bordIndexFromPos = (
  clientX: number,
  clientY: number,
  board: HTMLDivElement,
  element: HTMLDivElement
): { x: number; y: number } => {
  const tileSize = element.parentElement!.offsetHeight;
  const boardHeight = tileSize * VERTICAL_AXIS.length;

  const x = Math.floor((clientX - board.offsetLeft) / tileSize);
  const y = Math.abs(
    Math.ceil((clientY - board.offsetTop - boardHeight) / tileSize)
  );
  return { x, y };
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

const calculateAdvantageAndCaptures = (gameData: GameData) => {
  const advantage =
    gameData.gameState.whiteCaptured - gameData.gameState.blackCaptured;

  if (advantage > 0) {
    gameData.player1.advantage = advantage;
  } else if (advantage < 0) {
    gameData.player2.advantage = Math.abs(advantage);
  } else {
    gameData.player1.advantage = 0;
    gameData.player2.advantage = 0;
  }

  gameData.player1.captured = gameData.gameState.whiteCaptured;
  gameData.player2.captured = gameData.gameState.blackCaptured;
};

const Board = (props: Props) => {
  let { height, width } = props;
  const { parentRef, gameData, setGameData } = props;

  const element = parentRef?.current;

  if (element && height === 0 && width === 0) {
    const size = element?.getBoundingClientRect();
    height = size.height;
    width = size.width;
  }

  const minDim = Math.min(height - 252, width);

  const gameEngine = GameEngine.instance;
  const boardRef = useRef<HTMLDivElement>(null);

  const [grabPosition, setGrabPosition] = useState<Position>(
    new Position(-1, -1)
  );
  const [activePiece, setActivePiece] = useState<HTMLElement | null>(null);
  const [pieces, setPieces] = useState(parseBoardState(gameData.gameState));

  const board = [];

  const [activeTouch, setActiveTouch] = useState<Touch>();

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

  const grabPiece = (
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) => {
    let clientX: number;
    let clientY: number;

    e.preventDefault();

    console.log("GRAB PIECE EVENT");

    if (e instanceof MouseEvent) {
      clientX = e.clientX;
      clientY = e.clientY;
    } else {
      if (!activeTouch) {
        setActiveTouch((e as unknown as TouchEvent).touches[0]);
      }

      clientX = (e as unknown as TouchEvent).touches[0].clientX;
      clientY = (e as unknown as TouchEvent).touches[0].clientY;
    }

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
      const gridCoords = bordIndexFromPos(clientX, clientY, board, element);
      console.log(clientX, clientY, gridCoords.x, gridCoords.y);
      setGrabPosition(new Position(gridCoords.x, gridCoords.y));

      const size = element.offsetHeight;
      const x = clientX - size * 0.5;
      const y = clientY - size * 0.5;

      element.style.position = "absolute";
      element.style.left = `${x}px`;
      element.style.top = `${y}px`;
      element.style.height = `${size}px`;

      setActivePiece(element);
    }
  };

  const movePiece = (
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) => {
    const board = boardRef.current;

    let clientX: number;
    let clientY: number;

    if (e instanceof MouseEvent) {
      clientX = e.clientX;
      clientY = e.clientY;
    } else {
      clientX = activeTouch!.clientX;
      clientY = activeTouch!.clientY;

      for (const touch of (e as unknown as TouchEvent).changedTouches) {
        if (touch.identifier === activeTouch?.identifier) {
          clientX = touch.clientX;
          clientY = touch.clientY;
        }
      }
    }

    if (activePiece && board) {
      const size = activePiece.offsetHeight;

      const minX = board.offsetLeft;
      const minY = board.offsetTop;

      const maxX = board.offsetLeft + board.clientWidth - size * 0.75;
      const maxY = board.offsetTop + board.clientHeight - size * 0.75;

      const x = clientX - size * 0.5;
      const y = clientY - size * 0.5;

      activePiece.style.position = "absolute";
      activePiece.style.left = `${x > maxX ? maxX : Math.max(minX, x)}px`;
      activePiece.style.top = `${y > maxY ? maxY : Math.max(minY, y)}px`;
      activePiece.style.height = `${size}px`;
    }
  };

  const dropPiece = (
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) => {
    e.preventDefault();

    const board = boardRef.current;
    const element = e.target as HTMLDivElement;

    let clientX: number;
    let clientY: number;

    console.log("DROP PIECE EVENT");

    if (e instanceof MouseEvent) {
      clientX = e.clientX;
      clientY = e.clientY;
    } else {
      clientX = activeTouch!.clientX;
      clientY = activeTouch!.clientY;

      if ((e as unknown as TouchEvent).changedTouches) {
        for (const touch of (e as unknown as TouchEvent).changedTouches) {
          if (touch.identifier === activeTouch?.identifier) {
            clientX = touch.clientX;
            clientY = touch.clientY;
          }
        }
      }
    }

    if (activePiece && board) {
      const gridCoords = bordIndexFromPos(clientX, clientY, board, element);
      console.log(clientX, clientY, gridCoords.x, gridCoords.y);

      const newGameState = gameEngine.playMove(
        grabPosition,
        new Position(gridCoords.x, gridCoords.y)
      );

      if (newGameState) {
        setGameData((previous) => {
          const newGameData = { ...previous };
          calculateAdvantageAndCaptures(newGameData);
          return { ...previous, gameState: newGameState };
        });
        setPieces(() => parseBoardState(gameData.gameState));
      }

      activePiece.style.position = "static";
      activePiece.style.removeProperty("top");
      activePiece.style.removeProperty("left");
      activePiece.style.removeProperty("height");

      setActivePiece(null);
      setActiveTouch(undefined);
    }
  };

  const restartGame = () => {
    gameEngine.restart();
    setGameData((previous) => {
      const newGameData = { ...previous };
      newGameData.gameState = gameEngine.gameState;
      calculateAdvantageAndCaptures(newGameData);
      return newGameData;
    });
    setPieces(() => parseBoardState(gameData.gameState));
  };

  return (
    <>
      {!!gameData.gameState.winner && (
        <GameOverModal
          winner={gameData.gameState.winner}
          player1={gameData.player1}
          player2={gameData.player2}
          handleMouseClick={() => restartGame()}
        />
      )}
      <div
        id="board"
        ref={boardRef}
        className="grid grid-cols-8  border-black md:border-4 bg-emerald-200"
        onMouseDown={(e) => grabPiece(e)}
        onMouseMove={(e) => movePiece(e)}
        onMouseUp={(e) => dropPiece(e)}
        onTouchStart={(e) => grabPiece(e)}
        onTouchMove={(e) => movePiece(e)}
        onTouchEnd={(e) => dropPiece(e)}
        onContextMenu={(e) => e.preventDefault()}
        style={{
          height: minDim,
          width: minDim,
        }}
      >
        {board}
      </div>
    </>
  );
};

export default Board;
