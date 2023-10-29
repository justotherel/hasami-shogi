import { HORIZONTAL_AXIS, VERTICAL_AXIS } from "../constants";

export class Position {
  public readonly x: number;
  public readonly y: number;

  constructor(x: number, y: number) {
    this.x = x 
    this.y = y
  }

  public toIndex(): number {
    return this.x + this.y * VERTICAL_AXIS.length;
  }

  public isEqual(pos: Position): boolean {
    return this.x === pos.x && this.y === pos.y;
  }

  public clone(): Position {
    return new Position(this.x, this.y);
  }

  public toString() {
    return `[${this.x},${this.y}]`;
  }

  public crossNeighbors(): Position[] {
    const neighbors: Position[] = [];
    if (this.x > 0) neighbors.push(new Position(this.x - 1, this.y));
    if (this.x < HORIZONTAL_AXIS.length - 1)
      neighbors.push(new Position(this.x + 1, this.y));
    if (this.y > 0) neighbors.push(new Position(this.x, this.y - 1));
    if (this.y < HORIZONTAL_AXIS.length - 1)
      neighbors.push(new Position(this.x, this.y + 1));

    return neighbors;
  }

  public static fromIndex(index: number): Position {
    return new Position(
      index % HORIZONTAL_AXIS.length,
      Math.floor(index / HORIZONTAL_AXIS.length)
    );
  }
}
