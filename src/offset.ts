import { Point } from "./board";
import { ParseTree, ParseTreeIndex, RowIndex } from "./parse.pegjs";

export function getOffset(tree: ParseTree): Point {
  const size = tree[ParseTreeIndex.Size];
  const rows = tree[ParseTreeIndex.Rows];
  const firstRow = rows[0];
  const numRows = rows.length;

  return {
    row: !tree[ParseTreeIndex.NorthBorder] && numRows || size || tree[ParseTreeIndex.SouthBorder] && numRows || 19,
    col: firstRow[RowIndex.WestBorder] ? 0 : (size || 19) - firstRow[RowIndex.Cells].length,
  };
}
