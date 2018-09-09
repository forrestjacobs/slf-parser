import { NamedMatcher } from "./parser";

export function skipWsPost<T>(matcher: NamedMatcher<T>): NamedMatcher<T> {
  const fn = matcher[1];
  return [matcher[0], (body, index) => {
    const result = fn(body, index);
    if (result === undefined) {
      return;
    }
    const [value, size] = result;
    return [value, size + getWhitespaceLength(body, index + size)];
  }];
}

export function makeStringMatcher(str: string, name?: string): NamedMatcher<true> {
  const len = str.length;
  return [`'${name || str}'`, (body, index) =>
    body.substr(index, len) === str ? [true, len] : undefined];
}

function getLineLength(body: string, index: number): number {
  const newlineIndex = body.indexOf("\n", index);
  return (newlineIndex === -1 ? body.length : newlineIndex) - index;
}

export function makeRegExpMatcher(name: string, regexp: RegExp, bufferSize?: number): NamedMatcher<string> {
  return [name, (body, index) => {
    const size = bufferSize === undefined ? getLineLength(body, index) : bufferSize;
    const result = body.substr(index, size).match(regexp);
    if (result === null) {
      return;
    }
    const str = result[0];
    return [str, str.length];
  }];
}

export const EOT_MATCHER: NamedMatcher<true> = ["end of text", (body, index) =>
  index === body.length ? [true, 0] : undefined];

function getWhitespaceLength(body: string, index: number) {
  const length = body.length;
  for (let i = index; i < length; i++) {
    const char = body.charCodeAt(i);
    if (char !== 32 && char !== 9) {
      return i - index;
    }
  }
  return length - index;
}
