import { makeAxes } from "./axes";
import { Board } from "./board";
import { makeCellFn } from "./cell";
import { makeLines } from "./lines";
import { ParseTree, ParseTreeIndex, RowIndex } from "./parse.pegjs";

export function generateBoard(tree: ParseTree): Board {
  const size = tree[ParseTreeIndex.Size];
  const title = tree[ParseTreeIndex.Title];
  const northBorder = tree[ParseTreeIndex.NorthBorder];
  const rows = tree[ParseTreeIndex.Rows];
  const southBorder = tree[ParseTreeIndex.SouthBorder];

  const firstRow = rows[0];

  const numRows = rows.length;

  const rowOffset = !northBorder && numRows || size || southBorder && numRows || 19;
  const colOffset = firstRow[RowIndex.WestBorder] ? 0 : (size || 19) - firstRow[RowIndex.Cells].length;

  const makeCell = makeCellFn(tree);

  const board: Board = {
    cells: rows.map((row) => row[RowIndex.Cells].map(makeCell)),
    borders: {
      north: northBorder,
      east: firstRow[RowIndex.EastBorder],
      south: southBorder,
      west: firstRow[RowIndex.WestBorder],
    },
  };

  if (title !== "") {
    board.title = title;
  }

  if (tree[ParseTreeIndex.ShowAxis]) {
    board.axes = makeAxes(tree, rowOffset, colOffset);
  }

  const lines = makeLines(tree, rowOffset, colOffset);
  if (lines.length !== 0) {
    board.lines = lines;
  }

  return board;
}
