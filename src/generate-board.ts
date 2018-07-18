import { Board, Cell, CellType, Mark } from "./board";
import { ParseTree } from "./parse.pegjs";

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
    } else {
      cell = CELL_FOR_TOKEN[token] || { type: CellType.Intersection, label: token };
    }

    const link = links[token];
    return link ? { ...cell, link } : cell;
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
