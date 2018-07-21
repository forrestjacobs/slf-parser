import { makeAxes } from "./axes";
import { Board } from "./board";
import { makeCellFn } from "./cell";
import { makeLines } from "./lines";
import { getOffset } from "./offset";
import { ParseTree } from "./parse.pegjs";

export function generateBoard(tree: ParseTree): Board {
  const { title, rows } = tree;
  const firstRow = rows[0];
  const dimensions = getOffset(tree);

  const makeCell = makeCellFn(tree);

  const board: Board = {
    cells: rows.map((row) => row.cells.map(makeCell)),
    borders: {
      north: tree.northBorder,
      east: firstRow.eastBorder,
      south: tree.southBorder,
      west: firstRow.westBorder,
    },
  };

  if (title !== "") {
    board.title = title;
  }

  if (tree.showAxis) {
    board.axes = makeAxes(tree, dimensions);
  }

  const lines = makeLines(tree, dimensions);
  if (lines.length !== 0) {
    board.lines = lines;
  }

  return board;
}
