import { Board, Cell, CellType, Mark } from "./board";
import { ParseTree } from "./parse.pegjs";

const TYPE_FOR_TOKEN: {[token: string]: CellType} = {
  "#": CellType.Black,
  ",": CellType.Star,
  ".": CellType.Intersection,
  "@": CellType.White,
  "B": CellType.Black,
  "C": CellType.Intersection,
  "M": CellType.Intersection,
  "O": CellType.White,
  "P": CellType.White,
  "Q": CellType.White,
  "S": CellType.Intersection,
  "T": CellType.Intersection,
  "W": CellType.White,
  "X": CellType.Black,
  "Y": CellType.Black,
  "Z": CellType.Black,
  "_": CellType.Empty,
};

const MARK_FOR_TOKEN: {[token: string]: Mark} = {
  "#": Mark.Square,
  "@": Mark.Square,
  "B": Mark.Circle,
  "C": Mark.Circle,
  "M": Mark.Cross,
  "P": Mark.Cross,
  "Q": Mark.Triangle,
  "S": Mark.Square,
  "T": Mark.Triangle,
  "W": Mark.Circle,
  "Y": Mark.Triangle,
  "Z": Mark.Cross,
};

export function generateBoard(tree: ParseTree): Board {
  const { firstPlayer, startingNumber, title, northBorder, rows, southBorder, meta } = tree;
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
    } else if (TYPE_FOR_TOKEN[token]) {
      cell = { type: TYPE_FOR_TOKEN[token] };
      const mark = MARK_FOR_TOKEN[token];
      if (mark) {
        cell.mark = mark;
      }
    } else {
      cell = { type: CellType.Intersection, label: token };
    }

    const link = links[token];
    if (link) {
      cell.link = link;
    }

    return cell;
  }

  return {
    title: title === "" ? undefined : title,
    cells: rows.map((row) => row.cells.map(tokenToCell)),
    borders: {
      north: northBorder,
      east: rows[0].eastBorder,
      south: southBorder,
      west: rows[0].westBorder,
    },
  };
}
