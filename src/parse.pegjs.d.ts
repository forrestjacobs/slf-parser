export const enum RowIndex { WestBorder = 0, Cells = 1, EastBorder = 2 }
export type Row = [boolean, string[], boolean];

export const enum LinkMetaItemIndex { Cell = 0, Link = 1 }
export type LinkMetaItem = [string, string];

export const enum ParsePointIndex { Row = 0, Col = 1 }
export type ParsePoint = [number, number | string];

export const enum LineMetaItemIndex { Type = 0, Start = 1, End = 2 }
export type LineMetaItem = ["AR" | "LN", ParsePoint, ParsePoint];

export type MetaItem = LinkMetaItem | LineMetaItem;

export const enum ParseTreeIndex {
  FirstPlayer = 0,
  ShowAxis = 1,
  Size = 2,
  StartingNumber = 3,
  Title = 4,
  NorthBorder = 5,
  Rows = 6,
  SouthBorder = 7,
  Meta = 8
}

export type ParseTree = [
  "B" | "W" | null,
  boolean,
  number | null,
  number | null,
  string,
  boolean,
  Row[],
  boolean,
  MetaItem[]
];

export declare function parse(slf: string): ParseTree;
