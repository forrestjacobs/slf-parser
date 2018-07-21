import { Board, Cell, CellType, COLUMN_ALPHA, Line, LineType, Mark, Point } from "./board";
import { ParsePoint, ParsePointType, ParseTree } from "./parse.pegjs";

const CELL_FOR_TOKEN: {[token: string]: Cell} = {
  "#": { type: CellType.Black, mark: Mark.Square },
  ",": { type: CellType.Star },
  ".": { type: CellType.Intersection },
  "@": { type: CellType.White, mark: Mark.Square },
  "B": { type: CellType.Black, mark: Mark.Circle },
  "C": { type: CellType.Intersection, mark: Mark.Circle },
  "M": { type: CellType.Intersection, mark: Mark.Cross },
  "O": { type: CellType.White },
  "P": { type: CellType.White, mark: Mark.Cross },
  "Q": { type: CellType.White, mark: Mark.Triangle },
  "S": { type: CellType.Intersection, mark: Mark.Square },
  "T": { type: CellType.Intersection, mark: Mark.Triangle },
  "W": { type: CellType.White, mark: Mark.Circle },
  "X": { type: CellType.Black },
  "Y": { type: CellType.Black, mark: Mark.Triangle },
  "Z": { type: CellType.Black, mark: Mark.Cross },
  "_": { type: CellType.Empty },
};

interface BoardDimensions {
  width: number;
  height: number;
  rowOffset: number;
  colOffset: number;
}

function getDimensions(tree: ParseTree): BoardDimensions {
  const { size, northBorder, rows, southBorder } = tree;

  const numRows = rows.length;
  const { westBorder, cells, eastBorder } = rows[0];
  const numCols = cells.length;

  const width = size || westBorder && eastBorder && numCols || 19;
  const height = size || northBorder && southBorder && numRows || 19;
  const colOffset = westBorder ? 0 : width - numCols;
  const rowOffset = northBorder ? 0 : height - numRows;

  return { width, height, rowOffset, colOffset };
}

function makeAxes(tree: ParseTree, dimensions: BoardDimensions): Board["axes"] {
  const { rows, southBorder } = tree;
  const { westBorder } = rows[0];
  const { height, colOffset, rowOffset } = dimensions;

  return {
    x: {
      start: COLUMN_ALPHA.charAt(colOffset),
      position: southBorder ? "south" : "north",
    },
    y: {
      start: height - rowOffset,
      position: westBorder ? "west" : "east",
    },
  };
}

function makeLines(tree: ParseTree, dimensions: BoardDimensions): Line[] {
  const { height, colOffset, rowOffset } = dimensions;

  function toPoint(parsePoint: ParsePoint): Point {
    if (parsePoint.type === ParsePointType.Board) {
      return {
        row: height - parsePoint.row - rowOffset,
        col: COLUMN_ALPHA.indexOf(parsePoint.col) - colOffset,
      };
    }
    return {
      row: parsePoint.row - 1,
      col: parsePoint.col - 1,
    };
  }

  const lines: Line[] = [];
  for (const metaItem of tree.meta) {
    if (metaItem.type === "link") {
      continue;
    }

    lines.push({
      type: metaItem.type === "AR" ? LineType.Arrow : LineType.Line,
      start: toPoint(metaItem.start),
      end: toPoint(metaItem.end),
    });
  }
  return lines;
}

export function generateBoard(tree: ParseTree): Board {
  const { firstPlayer, showAxis, startingNumber, title, northBorder, rows, southBorder, meta } = tree;
  const { westBorder, eastBorder } = rows[0];

  const dimensions = getDimensions(tree);
  const blackFirst = firstPlayer !== "W";

  const links: {[key: string]: string} = {};
  for (const metaItem of meta) {
    if (metaItem.type === "link") {
      links[metaItem.cell] = metaItem.href;
    }
  }

  function tokenToCell(token: string): Cell {
    let cell: Cell;
    if (!isNaN(+token)) {
      const num = (startingNumber || 1) + (token === "0" ? 10 : +token) - 1;
      const type = (num % 2 === 1 ? blackFirst : !blackFirst) ? CellType.Black : CellType.White;
      cell = {type, label: `${num % 100}`};
    } else {
      cell = CELL_FOR_TOKEN[token] || { type: CellType.Intersection, label: token };
    }

    const link = links[token];
    return link ? { ...cell, link } : cell;
  }

  const board: Board = {
    cells: rows.map((row) => row.cells.map(tokenToCell)),
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
