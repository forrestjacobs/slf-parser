import { Cell, CellType, Mark } from "./board";
import { LinkMetaItemIndex, ParseTree, ParseTreeIndex } from "./parse-tree";

const BLACK = CellType.Black;
const WHITE = CellType.White;
const INTERSECTION = CellType.Intersection;

const CELL_TYPE_FOR_TOKEN: {[token: string]: CellType} = {
  "#": BLACK,
  ",": CellType.Star,
  ".": INTERSECTION,
  "@": WHITE,
  "B": BLACK,
  "C": INTERSECTION,
  "M": INTERSECTION,
  "O": WHITE,
  "P": WHITE,
  "Q": WHITE,
  "S": INTERSECTION,
  "T": INTERSECTION,
  "W": WHITE,
  "X": BLACK,
  "Y": BLACK,
  "Z": BLACK,
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

export function makeCellFn(tree: ParseTree): (token: string) => Cell {
  const startingNumber = tree[ParseTreeIndex.StartingNumber] || 1;
  const isBlackFirst = tree[ParseTreeIndex.IsBlackFirst];

  const links: {[key: string]: string} = {};
  for (const metaItem of tree[ParseTreeIndex.Links]) {
    links[metaItem[LinkMetaItemIndex.Cell]] = metaItem[LinkMetaItemIndex.Link];
  }

  function makeCell(token: string): Cell {
    let cell: Cell;
    const tokenNumber = +token;
    if (!isNaN(tokenNumber)) {
      const num = (tokenNumber === 0 ? 10 : tokenNumber) + startingNumber - 1;
      cell = {
        type: ((num % 2 === 1) === isBlackFirst) ? BLACK : WHITE,
        label: `${num % 100}`,
      };
    } else {
      const type = CELL_TYPE_FOR_TOKEN[token];
      const mark = MARK_FOR_TOKEN[token];
      cell = type && mark ? {type, mark} :
        type ? {type} :
        { type: INTERSECTION, label: token };
    }
    const link = links[token];
    if (link) {
      cell.link = link;
    }
    return cell;
  }

  return makeCell;
}
