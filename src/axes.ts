import { Board, COLUMN_ALPHA } from "./board";
import { BoardDimensions } from "./dimensions";
import { ParseTree } from "./parse.pegjs";

export function makeAxes(tree: ParseTree, dimensions: BoardDimensions): Board["axes"] {
  return {
    x: {
      start: COLUMN_ALPHA.charAt(dimensions.colOffset),
      position: tree.southBorder ? "south" : "north",
    },
    y: {
      start: dimensions.height - dimensions.rowOffset,
      position: tree.rows[0].westBorder ? "west" : "east",
    },
  };
}
