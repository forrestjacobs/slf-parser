import { makeAxes } from "./axes";
import { Board } from "./board";
import { makeCellFn } from "./cell";
import { getDimensions } from "./dimensions";
import { makeLines } from "./lines";
import { ParseTree } from "./parse.pegjs";

export function generateBoard(tree: ParseTree): Board {
  const { showAxis, title, northBorder, rows, southBorder } = tree;
  const { westBorder, eastBorder } = rows[0];

  const dimensions = getDimensions(tree);

  const makeCell = makeCellFn(tree);

  const board: Board = {
    cells: rows.map((row) => row.cells.map(makeCell)),
    borders: {
      north: northBorder,
      east: eastBorder,
      south: southBorder,
      west: westBorder,
    },
  };

  if (title !== "") {
    board.title = title;
  }

  if (showAxis) {
    board.axes = makeAxes(tree, dimensions);
  }

  const lines = makeLines(tree, dimensions);
  if (lines.length !== 0) {
    board.lines = lines;
  }

  return board;
}
