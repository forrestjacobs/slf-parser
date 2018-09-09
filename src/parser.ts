export type MatcherFn<T> = (body: string, index: number) => [T, number] | undefined;
export type NamedMatcher<T> = [string, MatcherFn<T>];

export class Parser {

  private readonly body: string;
  private expectations: string[];
  private index: number;

  constructor(body: string, start: number, end: number) {
    this.body = body.substr(0, end);
    this.expectations = [];
    this.index = start;
  }

  public match = <T>(matcher: NamedMatcher<T>): T | undefined => {
    const result = matcher[1](this.body, this.index);
    if (result === undefined) {
      this.expectations.push(matcher[0]);
      return;
    }
    this.index += result[1];
    this.expectations = [];
    return result[0];
  }

  public expect = <T>(matcher: NamedMatcher<T>): T => {
    const result = this.match(matcher);
    if (result === undefined) {
      throw new Error(`${this.index}: Expected ${this.expectations.join(", ")}`);
    }
    return result;
  }

}
