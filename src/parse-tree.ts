export const enum LinkMetaItemIndex { Cell = 0, Link = 1 }
export type LinkMetaItem = [string, string];

export const enum ParsePointIndex { Col = 0, Row = 1 }
export type ParsePoint = [number | string, number];

export const enum LineMetaItemIndex { IsArrow = 0, Start = 1, End = 2 }
export type LineMetaItem = [boolean, ParsePoint, ParsePoint];

export const enum ParseTreeIndex {
  IsBlackFirst = 0,
  ShowAxis = 1,
  Size = 2,
  StartingNumber = 3,
  Title = 4,
  NorthBorder = 5,
  WestBorder = 6,
  Rows = 7,
  EastBorder = 8,
  SouthBorder = 9,
  Links = 10,
  Lines = 11,
}

export type ParseTree = [
  boolean,
  boolean,
  number | undefined,
  number | undefined,
  string,
  boolean,
  boolean,
  string[][],
  boolean,
  boolean,
  LinkMetaItem[],
  LineMetaItem[]
];

export declare function parse(slf: string): ParseTree;
