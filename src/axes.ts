import { Board } from "./board";
import { ParseTree, ParseTreeIndex } from "./parse.pegjs";

export const COLUMN_ALPHA = "ABCDEFGHJKLMNOPQRST";

export function makeAxes(tree: ParseTree, rowOffset: number, colOffset: number): Board["axes"] {
  const rows = tree[ParseTreeIndex.Rows];

  const yAxisLabels: number[] = [];
  for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
    yAxisLabels.push(rowOffset - rowIndex);
  }

  return {
    x: {
      labels: COLUMN_ALPHA.substr(colOffset, rows[0].length),
      position: tree[ParseTreeIndex.SouthBorder] ? "south" : "north",
    },
    y: {
      labels: yAxisLabels,
      position: tree[ParseTreeIndex.WestBorder] ? "west" : "east",
    },
  };
}
