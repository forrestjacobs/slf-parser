export interface Row {
  cells: string[];
}

export interface ParseTree {
  rows: Row[];
}

export declare function parse(slf: string): ParseTree;
