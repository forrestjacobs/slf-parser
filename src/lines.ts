import { COLUMN_ALPHA, Line, LineType, Point } from "./board";
import { BoardDimensions } from "./dimensions";
import { ParsePoint, ParsePointType, ParseTree } from "./parse.pegjs";

export function makeLines(tree: ParseTree, dimensions: BoardDimensions): Line[] {
  const { height, colOffset, rowOffset } = dimensions;

  function toPoint(parsePoint: ParsePoint): Point {
    if (parsePoint.type === ParsePointType.Board) {
      return {
        row: height - parsePoint.row - rowOffset,
        col: COLUMN_ALPHA.indexOf(parsePoint.col) - colOffset,
      };
    }
    return {
      row: parsePoint.row - 1,
      col: parsePoint.col - 1,
    };
  }

  const lines: Line[] = [];
  for (const metaItem of tree.meta) {
    if (metaItem.type === "link") {
      continue;
    }

    lines.push({
      type: metaItem.type === "AR" ? LineType.Arrow : LineType.Line,
      start: toPoint(metaItem.start),
      end: toPoint(metaItem.end),
    });
  }
  return lines;
}
