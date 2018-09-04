import { makeAxes } from "./axes";
import { Board } from "./board";
import { makeCellFn } from "./cell";
import { makeLines } from "./lines";
import { ParseTree, ParseTreeIndex } from "./parse-tree";

export function generateBoard(tree: ParseTree): Board {
  const size = tree[ParseTreeIndex.Size];
  const title = tree[ParseTreeIndex.Title];
  const northBorder = tree[ParseTreeIndex.NorthBorder];
  const rows = tree[ParseTreeIndex.Rows];
  const southBorder = tree[ParseTreeIndex.SouthBorder];

  const numRows = rows.length;

  const rowOffset = !northBorder && numRows || size || southBorder && numRows || 19;
  const colOffset = tree[ParseTreeIndex.WestBorder] ? 0 : (size || 19) - rows[0].length;

  const makeCell = makeCellFn(tree);

  const board: Board = {
    cells: rows.map((row) => row.map(makeCell)),
    borders: {
      north: northBorder,
      east: tree[ParseTreeIndex.EastBorder],
      south: southBorder,
      west: tree[ParseTreeIndex.WestBorder],
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
