import { Point } from "./board";
import { ParseTree } from "./parse.pegjs";

export function getOffset(tree: ParseTree): Point {
  const { size, rows } = tree;
  const firstRow = rows[0];
  const numRows = rows.length;

  return {
    row: !tree.northBorder && numRows || size || tree.southBorder && numRows || 19,
    col: firstRow.westBorder ? 0 : (size || 19) - firstRow.cells.length,
  };
}
