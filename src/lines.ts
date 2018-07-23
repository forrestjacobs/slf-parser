import { COLUMN_ALPHA, Line, LineType, Point } from "./board";
import { LineMetaItemIndex, ParsePoint, ParsePointIndex, ParseTree, ParseTreeIndex } from "./parse.pegjs";

export function makeLines(tree: ParseTree, offset: Point): Line[] {
  const { col, row } = offset;

  function toPoint(parsePoint: ParsePoint): Point {
    const pCol = parsePoint[ParsePointIndex.Col];
    if (typeof pCol === "string") {
      return {
        row: row - parsePoint[ParsePointIndex.Row],
        col: COLUMN_ALPHA.indexOf(pCol) - col,
      };
    }
    return {
      row: parsePoint[ParsePointIndex.Row] - 1,
      col: pCol - 1,
    };
  }

  const lines: Line[] = [];
  for (const metaItem of tree[ParseTreeIndex.Meta]) {
    if (metaItem.length !== 3) {
      continue;
    }

    lines.push({
      type: metaItem[LineMetaItemIndex.Type] === "AR" ? LineType.Arrow : LineType.Line,
      start: toPoint(metaItem[LineMetaItemIndex.Start]),
      end: toPoint(metaItem[LineMetaItemIndex.End]),
    });
  }
  return lines;
}
