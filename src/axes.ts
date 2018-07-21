import { Board, COLUMN_ALPHA } from "./board";
import { BoardDimensions } from "./dimensions";
import { ParseTree } from "./parse.pegjs";

export function makeAxes(tree: ParseTree, dimensions: BoardDimensions): Board["axes"] {
  const { rows, southBorder } = tree;
  const { westBorder } = rows[0];
  const { height, colOffset, rowOffset } = dimensions;

  return {
    x: {
      start: COLUMN_ALPHA.charAt(colOffset),
      position: southBorder ? "south" : "north",
    },
    y: {
      start: height - rowOffset,
      position: westBorder ? "west" : "east",
    },
  };
}
