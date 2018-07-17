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

export type MetaItem = LinkMetaItem;

export interface ParseTree {
  firstPlayer: "B" | "W" | undefined;
  startingNumber?: number;
  title: string;
  northBorder: boolean;
  rows: Row[];
  southBorder: boolean;
  meta: MetaItem[];
}

export declare function parse(slf: string): ParseTree;
