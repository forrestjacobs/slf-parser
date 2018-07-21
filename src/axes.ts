import { Board, COLUMN_ALPHA, Point } from "./board";
import { ParseTree } from "./parse.pegjs";

export function makeAxes(tree: ParseTree, offset: Point): Board["axes"] {
  return {
    x: {
      start: COLUMN_ALPHA.charAt(offset.col),
      position: tree.southBorder ? "south" : "north",
    },
    y: {
      start: offset.row,
      position: tree.rows[0].westBorder ? "west" : "east",
    },
  };
}
