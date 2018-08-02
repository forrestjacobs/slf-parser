import { Board } from "./board";
import { generateBoard } from "./generate-board";
import { parse } from "./parse.pegjs";

export { COLUMN_ALPHA } from "./board";

export function toBoard(slf: string): Board {
  const parseTree = parse(slf);
  return generateBoard(parseTree);
}
