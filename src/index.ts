import { Board } from "./board";
import { generateBoard } from "./generate-board";
import { parse } from "./parse";
import { validate } from "./validate";

export function toBoard(slf: string): Board {
  const parseTree = parse(slf);
  const issues = validate(parseTree);
  if (issues.length !== 0) {
    throw new Error(issues.join("; "));
  }
  return generateBoard(parseTree);
}
