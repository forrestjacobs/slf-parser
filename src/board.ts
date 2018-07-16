export const COLUMN_ALPHA = "ABCDEFGHJKLMNOPQRST";

export interface Board {
  title?: string;
  cells: Cell[][];
  lines: Line[];
  borders: {
    north: boolean;
    east: boolean;
    south: boolean;
    west: boolean;
  };
  axes?: {
    x: {
      start: string;
      position: "north" | "south";
    };
    y: {
      start: number;
      position: "east" | "west";
    };
  };
}

export interface Cell {
  type: CellType;
  label?: string;
  link?: string;
  mark?: Mark;
}

export const enum CellType {
  Black = "black",
  White = "white",
  Intersection = "intersection",
  Star = "star",
  Empty = "empty",
}

export const enum Mark {
  Circle = "circle",
  Cross = "cross",
  Square = "square",
  Triangle = "triangle",
}

export interface Line {
  type: LineType;
  start: Point;
  end: Point;
}

export const enum LineType {
  Line = "line",
  Arrow = "arrow",
}

export interface Point {
  row: number;
  col: number;
}
