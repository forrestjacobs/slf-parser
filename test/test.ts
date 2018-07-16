import { readdirSync, readFileSync } from "fs";
import { safeLoadAll } from "js-yaml";
import { toBoard } from "../dist/bundle.js";

const FIXTURE_PATH = "./test";

function testDocument({diagram, error, board}: any) {
  try {
    const result = toBoard(diagram);
    if (error) {
      fail("Expected error, but it did not occur");
    }
    for (const key of Object.keys(board)) {
      expect(result[key]).toEqual(board[key]);
    }
  } catch (exception) {
    if (error) {
      return;
    }
    throw new Error(`${exception.message}\nDiagram:\n${diagram}\nLocation: ${JSON.stringify(exception.location)}`);
  }
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
