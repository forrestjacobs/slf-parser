export interface Row {
  cells: string[];
}

export interface ParseTree {
  title: string;
  rows: Row[];
}

export declare function parse(slf: string): ParseTree;
