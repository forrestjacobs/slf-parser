import { readdirSync, readFileSync } from "fs";
import { safeLoadAll } from "js-yaml";
import { toBoard } from "../dist/bundle.js";

const FIXTURE_PATH = "./test";
const FIXTURES = readdirSync(FIXTURE_PATH).filter((filename) => filename.endsWith(".yaml"));

describe.each(FIXTURES)("%s", (filename) => {
  const yaml = readFileSync(`${FIXTURE_PATH}/${filename}`, "utf8");
  const documents = safeLoadAll(yaml).map((document) => [document.name, document]);
  it.each(documents)("%s", (name, {diagram, error, board}) => {
    if (error) {
      return expect(() => toBoard(diagram)).toThrow();
    }

    expect(toBoard(diagram)).toMatchObject(board);
  });
});
