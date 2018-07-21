import { Cell, CellType, Mark } from "./board";
import { ParseTree } from "./parse.pegjs";

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

function getLinks(tree: ParseTree): {[key: string]: string} {
  const links: {[key: string]: string} = {};
  for (const metaItem of tree.meta) {
    if (metaItem.type === "link") {
      links[metaItem.cell] = metaItem.href;
    }
  }

  return links;
}

export function makeCellFn(tree: ParseTree): (token: string) => Cell {
  const startingNumber = tree.startingNumber || 1;
  const blackFirst = tree.firstPlayer !== "W";
  const links = getLinks(tree);

  function makeCell(token: string): Cell {
    const tokenNumber = +token;
    if (!isNaN(tokenNumber)) {
      const num = (tokenNumber === 0 ? 10 : tokenNumber) + startingNumber - 1;
      return {
        type: ((num % 2 === 1) === blackFirst) ? BLACK : WHITE,
        label: `${num % 100}`,
      };
    }

    const type = CELL_TYPE_FOR_TOKEN[token];
    const mark = MARK_FOR_TOKEN[token];
    return type && mark ? {type, mark} :
      type ? {type} :
      { type: INTERSECTION, label: token };
  }

  return (token) => {
    const cell = makeCell(token);
    const link = links[token];
    if (link) {
      cell.link = link;
    }
    return cell;
  };
}
