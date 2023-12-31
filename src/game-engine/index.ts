import {
  DEFAULT_STARTING_POSITION_FEN,
  HORIZONTAL_AXIS,
  VERTICAL_AXIS,
  WINNING_POSITIONS_INT32,
} from "../constants";

import { ActvieSide } from "./active-side";
import { GameState } from "./game-state";
import { Position } from "./position";
import { toInt32 } from "./int32-math-helper";
import { Winner } from "./winner";

enum PieceColor {
  WHITE = 1,
  BLACK = -1,
}

export class GameEngine {
  private static _instance: GameEngine;
  private readonly cols = HORIZONTAL_AXIS.length;
  private readonly rows = VERTICAL_AXIS.length;
  private readonly winningPositionsBitmaps = WINNING_POSITIONS_INT32;
  private readonly _gameState: GameState = {
    board: [],
    whiteCaptured: 0,
    blackCaptured: 0,
    actvieSide: ActvieSide.WHITE_TO_MOVE,
  };

  private removalQueue: number[] = [];

  private constructor(positionFen?: string) {
    this.setPosition(positionFen ? positionFen : DEFAULT_STARTING_POSITION_FEN);
  }

  public static get instance() {
    if (!GameEngine._instance) {
      GameEngine._instance = new GameEngine();
    }

    return GameEngine._instance;
  }

  public get gameState() {
    return this._gameState;
  }

  public restart() {
    this.gameState.board = [];
    this.gameState.whiteCaptured = 0;
    this.gameState.blackCaptured = 0;
    this.gameState.winner = undefined;
    this.gameState.actvieSide = ActvieSide.WHITE_TO_MOVE;
    this.removalQueue = [];
    this.setPosition(DEFAULT_STARTING_POSITION_FEN);
  }

  public isValidMove(startPos: Position, endPos: Position) {
    const validPosition = this.getValidMoves(startPos);
    return validPosition.includes(endPos.toIndex());
  }

  public getValidMoves(pos: Position): number[] {
    const validMoves: number[] = [];

    const neighbors = pos
      .crossNeighbors()
      .filter((el) => this.gameState.board[el.toIndex()] !== 0);

    neighbors.forEach((el) => {
      let direction = 0;

      if (el.x === pos.x) {
        direction = el.y - pos.y;
        const newY = el.y + direction;

        if (newY > 0 && newY < this.cols - 1) {
          const newIndex = new Position(el.x, newY).toIndex();
          if (this.gameState.board[newIndex] === 0) {
            validMoves.push(newIndex);
          }
        }
      }

      if (el.y === pos.y) {
        direction = el.x - pos.x;
        const newX = el.x + direction;
        if (newX > 0 && newX < this.cols - 1) {
          const newIndex = new Position(newX, el.y).toIndex();
          if (this.gameState.board[newIndex] === 0) {
            validMoves.push(newIndex);
          }
        }
      }
    });

    if (pos.x < this.cols - 1) {
      for (let i = pos.x + 1; i < this.cols; i++) {
        const nextIndex = this.coordsToIndex(i, pos.y);
        if (this.gameState.board[nextIndex]) {
          break;
        }
        validMoves.push(nextIndex);
      }
    }
    if (pos.x > 0) {
      for (let i = pos.x - 1; i >= 0; i--) {
        const nextIndex = this.coordsToIndex(i, pos.y);
        if (this.gameState.board[nextIndex]) {
          break;
        }
        validMoves.push(nextIndex);
      }
    }
    if (pos.y < this.rows - 1) {
      for (let i = pos.y + 1; i < this.rows; i++) {
        const nextIndex = this.coordsToIndex(pos.x, i);
        if (this.gameState.board[nextIndex]) {
          break;
        }
        validMoves.push(nextIndex);
      }
    }
    if (pos.y > 0) {
      for (let i = pos.y - 1; i >= 0; i--) {
        const nextIndex = this.coordsToIndex(pos.x, i);
        if (this.gameState.board[nextIndex]) {
          break;
        }
        validMoves.push(nextIndex);
      }
    }

    return validMoves;
  }

  private activeColor(): number {
    return this.gameState.actvieSide === ActvieSide.WHITE_TO_MOVE
      ? PieceColor.WHITE
      : PieceColor.BLACK;
  }

  public playMove(startPos: Position, endPos: Position): GameState | undefined {
    if (this.gameState.winner) return undefined;

    if (this.gameState.board[startPos.toIndex()] != this.activeColor()) {
      return undefined;
    }

    const validMoves = this.getValidMoves(startPos);

    if (!validMoves.includes(endPos.toIndex())) {
      console.log("Illigal move given, state not changed");
      return undefined;
    }

    this.movePiece(startPos, endPos);
    this.checkForCaptures(endPos);
    this.emptyRemovalQueue();
    this.gameState.winner = this.checkGameOverConditions();

    if (this.gameState.winner === undefined) {
      this.changeActiveColor();
    }

    return this.gameState;
  }

  private emptyRemovalQueue() {
    this.removalQueue.forEach((el) => this.removePiece(el));
    this.removalQueue = [];
  }

  private changeActiveColor() {
    this.gameState.actvieSide =
      this.gameState.actvieSide === ActvieSide.BLACK_TO_MOVE
        ? ActvieSide.WHITE_TO_MOVE
        : ActvieSide.BLACK_TO_MOVE;
  }

  private movePiece(startPos: Position, endPos: Position) {
    this.gameState.board[startPos.toIndex()] = 0;
    this.gameState.board[endPos.toIndex()] = this.activeColor();
  }

  private removePiece(pos: Position | number) {
    const index = typeof pos === "number" ? pos : pos.toIndex();

    if (this.gameState.board[index] === 1) {
      this.gameState.blackCaptured++;
    } else {
      this.gameState.whiteCaptured++;
    }

    this.gameState.board[index] = 0;
  }

  public checkGameOverConditions(): Winner | undefined {
    if (
      this.gameState.whiteCaptured > 14 &&
      this.gameState.blackCaptured > 14
    ) {
      return Winner.draw;
    }

    if (this.gameState.whiteCaptured > 14) {
      return Winner.white_won;
    }

    if (this.gameState.blackCaptured > 14) {
      return Winner.black_won;
    }

    const bitmap = this.getBoardBitmap(this.activeColor());

    if (this.winningPositionsBitmaps.some((bm) => (bm & bitmap) === bm)) {
      if (this.gameState.actvieSide === ActvieSide.WHITE_TO_MOVE)
        return Winner.white_won;
      if (this.gameState.actvieSide === ActvieSide.BLACK_TO_MOVE)
        return Winner.black_won;
    }

    return undefined;
  }

  public checkForCaptures(pos: Position) {
    const neighbors = pos
      .crossNeighbors()
      .filter((el) => !!this.gameState.board[el.toIndex()]);

    if (this.getNumberOfHostileNeighbors(pos) > 1) {
      this.removalQueue.push(pos.toIndex());
    }

    neighbors.forEach((el) => {
      if (this.getNumberOfHostileNeighbors(el) > 1) {
        this.removalQueue.push(el.toIndex());
      }
    });
  }

  private getNumberOfHostileNeighbors(pos: Position): number {
    const pieceValue = this.gameState.board[pos.toIndex()];

    if (!pieceValue) {
      throw new Error(
        `Unable to find hostile neighbors: position [${pos.x}, ${pos.y}] does not contain a piece`
      );
    }

    return pos
      .crossNeighbors()
      .filter((el) => this.gameState.board[el.toIndex()] === pieceValue * -1)
      .length;
  }

  private getBoardBitmap(color: PieceColor): number {
    const colorValue = color * -1;
    const bitmapArray = [
      ...this.gameState.board.slice(
        HORIZONTAL_AXIS.length * 2,
        HORIZONTAL_AXIS.length * 6
      ),
    ].map((el) => Number(el !== colorValue && el !== 0));
    return parseInt(bitmapArray.join(""), 2);
  }

  // parseFen()
  private setPosition(fen: string) {
    const fenBlocks = fen.split(" ");
    const rows = fenBlocks[0].split("/");

    this.gameState.actvieSide = fenBlocks[1] as ActvieSide;

    rows
      .slice()
      .reverse()
      .forEach((row, y) => {
        let offset = 0;

        [...row].forEach((ch, x) => {
          const index = this.coordsToIndex(x, y);

          switch (ch) {
            case "P":
              this.gameState.board[index + offset] = 1;
              break;

            case "p":
              this.gameState.board[index + offset] = -1;
              break;

            default:
              offset += parseInt(ch) - 1;
              break;
          }
        });
      });

    for (let i = 0; i < this.rows * this.cols; i++) {
      if (this.gameState.board[i] === undefined) this.gameState.board[i] = 0;
    }
  }

  public computeWinningPositionsBitmaps() {
    const winningPositionsBitmaps: number[] = [];

    for (let i = 0; i < 8; i++) {
      const bitmap: number[] = Array(32).fill(0);
      for (let x = i; x < 32; x += 8) {
        bitmap[x] = 1;
      }
      winningPositionsBitmaps.push(toInt32(parseInt(bitmap.join(), 2)));
    }

    for (let i = 0; i < 5; i++) {
      const bitmap: number[] = Array(32).fill(0);
      for (let x = 0; x < 4; x++) {
        const index = x * 9 + i;
        bitmap[index] = 1;
      }
      winningPositionsBitmaps.push(toInt32(parseInt(bitmap.join(), 2)));
    }

    for (let i = 3; i < 8; i++) {
      const bitmap: number[] = Array(32).fill(0);
      for (let x = 0; x < 4; x++) {
        const index = x * 7 + i;
        bitmap[index] = 1;
      }
      winningPositionsBitmaps.push(toInt32(parseInt(bitmap.join(), 2)));
    }

    return winningPositionsBitmaps;
  }

  // remove this use Position.toIndex instead
  public coordsToIndex(x: number, y: number) {
    return x + y * this.rows;
  }
}
