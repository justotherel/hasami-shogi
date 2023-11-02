import { Player } from "./player";
import { GameState } from "../game-engine/game-state";

export interface GameData {
  player1: Player;
  player2: Player;
  gameState: GameState;
}
