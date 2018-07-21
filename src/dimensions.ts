import { ParseTree } from "./parse.pegjs";

export interface BoardDimensions {
  width: number;
  height: number;
  rowOffset: number;
  colOffset: number;
}

export function getDimensions(tree: ParseTree): BoardDimensions {
  const { size, northBorder, rows, southBorder } = tree;
  const { westBorder, cells, eastBorder } = rows[0];

  const numRows = rows.length;
  const numCols = cells.length;

  const width = size || westBorder && eastBorder && numCols || 19;
  const height = size || northBorder && southBorder && numRows || 19;

  const colOffset = westBorder ? 0 : width - numCols;
  const rowOffset = northBorder ? 0 : height - numRows;

  return { width, height, rowOffset, colOffset };
}
