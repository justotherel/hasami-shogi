import { PieceColor } from "./piece-color";

export interface Player {
    name: string;
    image: string;
    captured?: number;
    advantage?: number;
    pieceColor: PieceColor;
  }