import { LineMetaItem, LinkMetaItem, ParsePoint, ParseTree } from "./parse-tree";

export function parse(slf: string): ParseTree {
  slf = slf.replace(/\r\n/g, "\n").replace(/[ \t\n]+$/, "");
  const length = (slf.match(/[ \t\n]*$/) as RegExpMatchArray).index as number;
  let index = (slf.match(/^[ \t\n]*/) as RegExpMatchArray)[0].length;

  let expectations: string[] = [];

  function buildExpectation<V>(value: V, valueDescription?: string | undefined): V {
    if (value) {
      expectations = [];
    } else if (valueDescription) {
      expectations.push(valueDescription);
    }
    return value;
  }

  function expect(value: boolean, valueDescription?: string | undefined): true;
  function expect<V>(value: V | undefined, valueDescription?: string | undefined): V;
  function expect(value: any, valueDescription?: string | undefined) {
    if (!buildExpectation(value, valueDescription)) {
      throw new Error(`${index}: Expected ${expectations.join(", ")}`);
    }
    return value;
  }

  function sizeForLine() {
    const indexOfNewline = slf.indexOf("\n", index);
    return (indexOfNewline === -1 ? length : indexOfNewline) - index;
  }

  function match(bufferSize: number, regexp: RegExp, group?: number): string | undefined {
    const result = slf.substr(index, bufferSize).match(regexp);
    if (result === null) {
      return;
    }
    const str = result[group || 0];
    index += str.length;
    return str;
  }

  function skipWhitespace() {
    match(sizeForLine(), /^[ \t]*/);
  }

  function matchNatural(): number | undefined {
    const natural = match(sizeForLine(), /^[1-9][0-9]*/);
    return natural ? +natural : undefined;
  }

  function expect$$() {
    expect(match(2, /\$\$/), "$$");
  }

  function expectDelim() {
    expect(match(1, /\n/), "new line");
    skipWhitespace();
    expect$$();
    skipWhitespace();
  }

  function expectDelimOrEof() {
    if (!buildExpectation(index === length, "end")) {
      expectDelim();
    }
  }

  function matchLatitudinalBorder(): boolean {
    const border = match(sizeForLine(), /^[-|+]{2,}/) !== undefined;
    skipWhitespace();
    return border;
  }

  function matchLongitudinalBorder(): boolean {
    const border = match(1, /[-|+]/) !== undefined;
    skipWhitespace();
    return border;
  }

  function matchCell(): string | undefined {
    const cell = match(1, /[0-9a-z.,XOBW#@YQZPCSTM_]/);
    skipWhitespace();
    return cell;
  }

  expect$$();
  const firstPlayer = match(1, /[BW]/) as "B" | "W" | undefined;
  const showAxis = match(1, /c/) === "c";
  const size = matchNatural();
  const startingNumber = match(1, /m/) === "m" ? expect(matchNatural(), "starting number") : undefined;
  skipWhitespace();
  const title = match(sizeForLine(), /(.*?)[ \t]*$/, 1) || "";
  skipWhitespace();
  expectDelim();

  const northBorder = buildExpectation(matchLatitudinalBorder(), "north border");
  if (northBorder) {
    expectDelim();
  }

  const westBorder = buildExpectation(matchLongitudinalBorder(), "west border");
  const firstRow: string[] = [];
  for (let c: string | undefined = expect(matchCell(), "cell"); c !== undefined; c = matchCell()) {
    firstRow.push(c);
  }
  buildExpectation(false, "cell");
  const eastBorder = buildExpectation(matchLongitudinalBorder(), "east border");
  expectDelimOrEof();

  const cells = [firstRow];
  const cols = firstRow.length;

  const links: LinkMetaItem[] = [];
  function matchLink(): boolean {
    if (!buildExpectation(match(1, /\[/), "link start")) {
      return false;
    }
    skipWhitespace();
    const cell = expect(matchCell(), "cell");
    expect(match(1, /\|/), "pipe");
    skipWhitespace();
    const url = expect(match(sizeForLine(), /(.+?)[ \t]*\][ \t]*$/, 1), "url");
    skipWhitespace();
    expect(match(1, /]/), "link end");
    links.push([cell, url]);
    return true;
  }

  function expectPoint(): ParsePoint {
    const x = buildExpectation(matchNatural(), "number");
    if (x !== undefined) {
      expect(match(1, /:/), "colon");
      const y = expect(matchNatural(), "number");
      return [x, y];
    }
    const c = expect(match(1, /[A-HJ-T]/), "column");
    const r = expect(matchNatural(), "number");
    return [c, r];
  }

  const lines: LineMetaItem[] = [];
  function matchLine(): boolean {
    if (!buildExpectation(match(1, /{/), "line start")) {
      return false;
    }
    skipWhitespace();
    const type = expect(match(2, /(AR|LN)/), "arrow or line") as "AR" | "LN";
    skipWhitespace();
    const start = expectPoint();
    skipWhitespace();
    const end = expectPoint();
    skipWhitespace();
    expect(match(1, /}/), "line end");
    lines.push([type, start, end]);
    return true;
  }

  let southBorder = false;
  function matchSouthBorder(): boolean {
    southBorder = buildExpectation(matchLatitudinalBorder(), "south border");
    return southBorder;
  }

  function expectRow(): true {
    if (westBorder) {
      expect(matchLongitudinalBorder(), "west border");
    }
    const row = [];
    for (let col = 0; col < cols; col++) {
      row.push(expect(matchCell(), "cell"));
    }
    cells.push(row);
    if (eastBorder) {
      expect(matchLongitudinalBorder(), "east border");
    }
    return true;
  }

  while (index < length) {
    if (southBorder || links.length !== 0 || lines.length !== 0) {
      expect(matchLink() || matchLine());
    } else {
      expect(matchLink() || matchLine() || matchSouthBorder() || expectRow());
    }
    skipWhitespace();
    expectDelimOrEof();
  }

  return [firstPlayer, showAxis, size, startingNumber, title,
    northBorder, westBorder, cells, eastBorder, southBorder,
    links, lines];
}
