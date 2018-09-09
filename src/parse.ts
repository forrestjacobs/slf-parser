import { EOT_MATCHER, makeRegExpMatcher, makeStringMatcher, skipWsPost } from "./matchers";
import { LineMetaItem, LinkMetaItem, ParsePoint, ParseTree } from "./parse-tree";
import { NamedMatcher, Parser } from "./parser";

const NUMBER_TITLE_MATCHER: NamedMatcher<number> = ["number", (body, index) => {
  const result = body.substr(index).match(/^[0-9]+/);
  if (result !== null) {
    const str = result[0];
    return [+str, str.length];
  }
  return;
}];
const NUMBER_MATCHER = skipWsPost(NUMBER_TITLE_MATCHER);

const $$_TITLE_MATCHER = makeStringMatcher("$$");
const $$_MATCHER = skipWsPost($$_TITLE_MATCHER);

const NEWLINE_MATCHER = makeStringMatcher("\n", "new line");

const BLACK_MATCHER = makeStringMatcher("B");
const WHITE_MATCHER = makeStringMatcher("W");
const AXIS_MATCHER = makeStringMatcher("c");
const M_MATCHER = makeStringMatcher("m");
const TITLE_MATCHER = makeRegExpMatcher("title", /[^$]*/);

const HORIZONTAL_BORDER_MATCHER = skipWsPost(makeRegExpMatcher("horizontal border", /^[-|+]{2,}/));
const VERTICAL_BORDER_MATCHER = skipWsPost(makeRegExpMatcher("vertical border", /[-|+]/, 1));
const CELL_MATCHER = skipWsPost(makeRegExpMatcher("cell", /[0-9a-z.,XOBW#@YQZPCSTM_]/, 1));

const LINK_START_MATCHER = skipWsPost(makeStringMatcher("["));
const LINK_SEPARATOR_MATCHER = skipWsPost(makeStringMatcher("|"));
const LINK_URL_MATCHER = skipWsPost(makeRegExpMatcher("url", /[^ \t]+(?=[ \t]*\][ \t]*$)/));
const LINK_END_MATCHER = skipWsPost(makeStringMatcher("]"));

const LINE_START_MATCHER = skipWsPost(makeStringMatcher("{"));
const ARROW_MATCHER = skipWsPost(makeStringMatcher("AR"));
const LINE_MATCHER = skipWsPost(makeStringMatcher("LN"));
const COLON_MATCHER = skipWsPost(makeStringMatcher(":"));
const COLUMN_MATCHER = skipWsPost(makeRegExpMatcher("column", /[A-HJ-T]/, 1));
const LINE_END_MATCHER = skipWsPost(makeStringMatcher("}"));

function isDefined<T>(value: T | undefined): boolean {
  return value !== undefined;
}

export function parse(slf: string): ParseTree {
  const body = slf.replace(/\r\n/g, "\n");
  const start = (slf.match(/^[ \t\n]*/) as RegExpMatchArray)[0].length;
  const end = (slf.match(/[ \t\n]*$/) as RegExpMatchArray).index as number;
  const { expect, match } = new Parser(body, start, end);

  function expectDelim() {
    expect(NEWLINE_MATCHER);
    expect($$_MATCHER);
  }

  expect($$_TITLE_MATCHER);
  const isBlackFirst = isDefined(match(BLACK_MATCHER)) || !isDefined(match(WHITE_MATCHER));
  const showAxis = isDefined(match(AXIS_MATCHER));
  const size = match(NUMBER_TITLE_MATCHER);
  const startingNumber = isDefined(match(M_MATCHER)) ? expect(NUMBER_TITLE_MATCHER) : undefined;
  const title = expect(TITLE_MATCHER).trim();
  expectDelim();

  const northBorder = isDefined(match(HORIZONTAL_BORDER_MATCHER));
  if (northBorder) {
    expectDelim();
  }

  const westBorder = isDefined(match(VERTICAL_BORDER_MATCHER));
  const firstRow: string[] = [];
  for (let c: string | undefined = expect(CELL_MATCHER); c !== undefined; c = match(CELL_MATCHER)) {
    firstRow.push(c);
  }
  const eastBorder = isDefined(match(VERTICAL_BORDER_MATCHER));

  const cells = [firstRow];
  const cols = firstRow.length;

  const links: LinkMetaItem[] = [];
  function matchLink(): boolean {
    if (!match(LINK_START_MATCHER)) {
      return false;
    }
    const cell = expect(CELL_MATCHER);
    expect(LINK_SEPARATOR_MATCHER);
    const url = expect(LINK_URL_MATCHER);
    expect(LINK_END_MATCHER);
    links.push([cell, url]);
    return true;
  }

  function expectPoint(): ParsePoint {
    const x = match(NUMBER_MATCHER);
    if (x !== undefined) {
      expect(COLON_MATCHER);
      const y = expect(NUMBER_MATCHER);
      return [x, y];
    }
    const c = expect(COLUMN_MATCHER);
    const r = expect(NUMBER_MATCHER);
    return [c, r];
  }

  const lines: LineMetaItem[] = [];
  function matchLine(expected: boolean): boolean {
    if (expected) {
      expect(LINE_START_MATCHER);
    } else if (!match(LINE_START_MATCHER)) {
      return false;
    }

    const isArrow = isDefined(match(ARROW_MATCHER));
    if (!isArrow) {
      expect(LINE_MATCHER);
    }
    const startPoint = expectPoint();
    const endPoint = expectPoint();
    expect(LINE_END_MATCHER);
    lines.push([isArrow, startPoint, endPoint]);
    return true;
  }

  let southBorder = false;
  function matchSouthBorder(): boolean {
    southBorder = isDefined(match(HORIZONTAL_BORDER_MATCHER));
    return southBorder;
  }

  function expectRow(): true {
    if (westBorder) {
      expect(VERTICAL_BORDER_MATCHER);
    }
    const row = [];
    for (let col = 0; col < cols; col++) {
      row.push(expect(CELL_MATCHER));
    }
    cells.push(row);
    if (eastBorder) {
      expect(VERTICAL_BORDER_MATCHER);
    }
    return true;
  }

  while (!match(EOT_MATCHER)) {
    expectDelim();
    if (southBorder || links.length !== 0 || lines.length !== 0) {
      // tslint:disable-next-line:no-unused-expression
      matchLink() || matchLine(true);
    } else {
      // tslint:disable-next-line:no-unused-expression
      matchLink() || matchLine(false) || matchSouthBorder() || expectRow();
    }
  }

  return [isBlackFirst, showAxis, size, startingNumber, title,
    northBorder, westBorder, cells, eastBorder, southBorder,
    links, lines];
}
