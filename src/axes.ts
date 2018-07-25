import { Board, COLUMN_ALPHA } from "./board";
import { ParseTree, ParseTreeIndex, RowIndex } from "./parse.pegjs";

export function makeAxes(tree: ParseTree, rowOffset: number, colOffset: number): Board["axes"] {
  return {
    x: {
      start: COLUMN_ALPHA[colOffset],
      position: tree[ParseTreeIndex.SouthBorder] ? "south" : "north",
    },
    y: {
      start: rowOffset,
      position: tree[ParseTreeIndex.Rows][0][RowIndex.WestBorder] ? "west" : "east",
    },
  };
}
