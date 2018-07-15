import { Board } from "./board";

export function toBoard(slf: string): Board {
  return {
    cells: [],
    lines: [],
    borders: {
      north: false,
      east: false,
      south: false,
      west: false,
    },
  };
}
