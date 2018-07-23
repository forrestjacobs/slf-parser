import { Board, COLUMN_ALPHA, Point } from "./board";
import { ParseTree, ParseTreeIndex, RowIndex } from "./parse.pegjs";

export function makeAxes(tree: ParseTree, offset: Point): Board["axes"] {
  return {
    x: {
      start: COLUMN_ALPHA[offset.col],
      position: tree[ParseTreeIndex.SouthBorder] ? "south" : "north",
    },
    y: {
      start: offset.row,
      position: tree[ParseTreeIndex.Rows][0][RowIndex.WestBorder] ? "west" : "east",
    },
  };
}
