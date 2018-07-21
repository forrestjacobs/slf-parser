import { ParseTree } from "./parse.pegjs";

export interface BoardDimensions {
  height: number;
  rowOffset: number;
  colOffset: number;
}

export function getDimensions(tree: ParseTree): BoardDimensions {
  const { size, northBorder, rows } = tree;
  const firstRow = rows[0];
  const { westBorder } = firstRow;

  const numRows = rows.length;
  const numCols = firstRow.cells.length;

  const width = size || westBorder && firstRow.eastBorder && numCols || 19;
  const height = size || northBorder && tree.southBorder && numRows || 19;

  const colOffset = westBorder ? 0 : width - numCols;
  const rowOffset = northBorder ? 0 : height - numRows;

  return { height, rowOffset, colOffset };
}
