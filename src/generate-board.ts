import { makeAxes } from "./axes";
import { Board } from "./board";
import { makeCellFn } from "./cell";
import { makeLines } from "./lines";
import { getOffset } from "./offset";
import { ParseTree, ParseTreeIndex, RowIndex } from "./parse.pegjs";

export function generateBoard(tree: ParseTree): Board {
  const title = tree[ParseTreeIndex.Title];
  const rows = tree[ParseTreeIndex.Rows];
  const firstRow = rows[0];
  const dimensions = getOffset(tree);

  const makeCell = makeCellFn(tree);

  const board: Board = {
    cells: rows.map((row) => row[RowIndex.Cells].map(makeCell)),
    borders: {
      north: tree[ParseTreeIndex.NorthBorder],
      east: firstRow[RowIndex.EastBorder],
      south: tree[ParseTreeIndex.SouthBorder],
      west: firstRow[RowIndex.WestBorder],
    },
  };

  if (title !== "") {
    board.title = title;
  }

  if (tree[ParseTreeIndex.ShowAxis]) {
    board.axes = makeAxes(tree, dimensions);
  }

  const lines = makeLines(tree, dimensions);
  if (lines.length !== 0) {
    board.lines = lines;
  }

  return board;
}
