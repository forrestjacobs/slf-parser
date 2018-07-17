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
  const { firstPlayer, startingNumber, title, northBorder, rows, southBorder } = tree;
  const blackFirst = firstPlayer !== "W";

  function tokenToCell(token: string): Cell {
    const tokenNum = +token;
    if (!isNaN(tokenNum)) {
      const num = (startingNumber || 1) + (tokenNum === 0 ? 10 : tokenNum) - 1;
      const type = (num % 2 === 1 ? blackFirst : !blackFirst) ? CellType.Black : CellType.White;
      return {type, label: `${num % 100}`};
    }
    const mappedType = TYPE_FOR_TOKEN[token];
    if (mappedType !== undefined) {
      return { type: mappedType, mark: MARK_FOR_TOKEN[token] };
    }
    return { type: CellType.Intersection, label: token };
  }

  return {
    title: title === "" ? undefined : title,
    cells: rows.map((row) => row.cells.map(tokenToCell)),
    lines: [],
    borders: {
      north: northBorder,
      east: rows[0].eastBorder,
      south: southBorder,
      west: rows[0].westBorder,
    },
  };
}
