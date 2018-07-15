import { readdirSync, readFileSync } from "fs";
import { safeLoadAll } from "js-yaml";
import { toBoard } from "../dist/bundle.js";

const FIXTURE_PATH = "./test";

function testDocument({diagram, board}: any) {
  expect(toBoard(diagram)).toEqual(board);
}

function testFixture(filename: string) {
  for (const document of safeLoadAll(readFileSync(`${FIXTURE_PATH}/${filename}`, "utf8"))) {
    it(document.name, () => testDocument(document));
  }
}

function testFixtures() {
  for (const filename of readdirSync(FIXTURE_PATH)) {
    if (filename.endsWith(".yaml")) {
      describe(filename, () => testFixture(filename));
    }
  }
}

testFixtures();
