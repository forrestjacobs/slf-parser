export interface Row {
  westBorder: boolean;
  cells: string[];
  eastBorder: boolean;
}

export interface LinkMetaItem {
  type: "link";
  cell: string;
  href: string;
}

export const enum ParsePointType { Absolute = 0, Board = 1 }

export interface AbsoluteParsePoint {
  type: ParsePointType.Absolute;
  row: number;
  col: number;
}

export interface BoardParsePoint {
  type: ParsePointType.Board;
  row: number;
  col: string;
}

export type ParsePoint = AbsoluteParsePoint | BoardParsePoint;

export interface LineMetaItem {
  type: "AR" | "LN";
  start: ParsePoint;
  end: ParsePoint;
}

export type MetaItem = LinkMetaItem | LineMetaItem;

export interface ParseTree {
  firstPlayer: "B" | "W" | null;
  showAxis: boolean;
  size: number | null;
  startingNumber: number | null;
  title: string;
  northBorder: boolean;
  rows: Row[];
  southBorder: boolean;
  meta: MetaItem[];
}

export declare function parse(slf: string): ParseTree;
