import { ActvieSide } from "./active-side";
import { Winner } from "./winner";

export interface GameState {
  board: number[];
  actvieSide: ActvieSide;
  winner?: Winner;
  whiteCaptured: number;
  blackCaptured: number;
}
