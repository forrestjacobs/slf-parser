import { readdirSync, readFileSync } from "fs";
import { safeLoadAll } from "js-yaml";
import { toBoard as testToBoard } from "../dist/bundle-cjs.js";
import { toBoard as cjsToBoard } from "../dist/test-bundle.js";

const FIXTURE_PATH = "./test";
const FIXTURES = readdirSync(FIXTURE_PATH).filter((filename) => filename.endsWith(".yaml"));
const TO_BOARD_FNS = [testToBoard, cjsToBoard];

describe.each(FIXTURES)("%s", (filename) => {
  const yaml = readFileSync(`${FIXTURE_PATH}/${filename}`, "utf8");
  const documents = safeLoadAll(yaml).map((document) => [document.name, document]);
  for (const toBoard of TO_BOARD_FNS) {
    it.each(documents)("%s", (name, {diagram, lacks, match, error, board}) => {
      if (error) {
        expect(() => toBoard(diagram)).toThrow();
      } else if (lacks) {
        expect(toBoard(diagram)).not.toHaveProperty(lacks);
      } else if (match === "exact") {
        expect(toBoard(diagram)).toStrictEqual(board);
      } else {
        expect(toBoard(diagram)).toMatchObject(board);
      }
    });
  }
});
