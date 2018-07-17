export interface Row {
  westBorder: boolean;
  cells: string[];
  eastBorder: boolean;
}

export interface ParseTree {
  firstPlayer: "B" | "W" | undefined;
  startingNumber?: number;
  title: string;
  northBorder: boolean;
  rows: Row[];
  southBorder: boolean;
}

export declare function parse(slf: string): ParseTree;
