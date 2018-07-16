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

function tokenToCell(token: string): Cell {
  const tokenNum = +token;
  if (!isNaN(tokenNum)) {
    const num = tokenNum === 0 ? 10 : tokenNum;
    const type = num % 2 === 1 ? CellType.Black : CellType.White;
    return {type, label: `${num}`};
  }
  const mappedType = TYPE_FOR_TOKEN[token];
  if (mappedType !== undefined) {
    return { type: mappedType, mark: MARK_FOR_TOKEN[token] };
  }
  return { type: CellType.Intersection, label: token };
}

export function generateBoard({ title, rows }: ParseTree): Board {
  return {
    title: title === "" ? undefined : title,
    cells: rows.map((row) => row.cells.map(tokenToCell)),
    lines: [],
    borders: {
      north: false,
      east: false,
      south: false,
      west: false,
    },
  };
}
