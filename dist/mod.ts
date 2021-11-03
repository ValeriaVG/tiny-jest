export type TestResult = {
  title: string;
  skipped?: boolean;
  passed?: boolean;
  error?: Error;
};

export type FixtureFn = () => Promise<void> | void;
export class Test {
  title: string;
  suite: { title: string; fn?: Function }[] = [];
  // Stores last results
  results: TestResult[] = [];
  private _before: FixtureFn[] = [];
  private _after: FixtureFn[] = [];
  constructor(title?: string) {
    this.title = title ?? "";
  }
  it = (title: string, fn?: Function) => {
    this.suite.push({ title, fn });
  };
  xit = (title: string, _fn?: Function) => {
    this.suite.push({ title });
  };
  run = async (): Promise<TestResult[]> => {
    this.results = [];
    try {
      await Promise.all(this._before.map((fn) => fn()));
    } catch (error) {
      return [{ title: this.title, error, passed: false }];
    }
    for (let test of this.suite) {
      if (!test.fn) {
        this.results.push({ title: test.title, skipped: true });
        continue;
      }
      try {
        await test.fn();
        this.results.push({ title: test.title, passed: true });
      } catch (error) {
        this.results.push({ title: test.title, error, passed: false });
      }
    }
    try {
      await Promise.all(this._after.map((fn) => fn()));
    } catch (error) {
      console.error(error);
    }
    return this.results;
  };
  before = (fn: FixtureFn) => {
    this._before.push(fn);
  };
  after = (fn: FixtureFn) => {
    this._after.push(fn);
  };
}

export class ExpectationError extends Error {
  extensions: { matcher: string; expected: any; actual: any };
  constructor(matcher: string, expected: any, actual: any, diff: string) {
    super(diff);
    this.extensions = { matcher, expected, actual };
  }
}

export type Expectation<T> = (expected: T) => void;

export type Expectations = {
  toBe: Expectation<any>;
  toEqual: Expectation<any>;
  toBeTruthy: Expectation<void>;
  toBeFalsy: Expectation<void>;
  toMatchObject: Expectation<Object>;
  toThrow: Expectation<RegExp | void>;
  toBeGreaterThan: Expectation<number>;
  toBeGreaterThanOrEqual: Expectation<number>;
  toBeLessThan: Expectation<number>;
  toBeLessThanOrEqual: Expectation<number>;
};

export type Matcher = (actual: any, expected: any) => false | string;

const matchers: Record<keyof Expectations, Matcher> = {
  toBe: (actual: any, expected: any) => {
    return expected === actual
      ? false
      : `Expected ${JSON.stringify(actual)} to be ${JSON.stringify(expected)}`;
  },
  toEqual: (actual: any, expected: any) => {
    return expected == actual
      ? false
      : `Expected ${JSON.stringify(actual)} to equal ${JSON.stringify(
          expected
        )}`;
  },
  toBeTruthy: (actual: any) => {
    return actual ? false : `Expected ${JSON.stringify(actual)} to be truthy`;
  },
  toBeFalsy: (actual: any) => {
    return actual ? `Expected ${JSON.stringify(actual)} to be falsy` : false;
  },
  toMatchObject: (actual: any, expected: any): string | false => {
    const error = `${JSON.stringify(actual)} does not match ${JSON.stringify(
      expected
    )}`;
    if (
      typeof actual !== typeof expected ||
      Array.isArray(actual) !== Array.isArray(expected)
    )
      return error;
    for (let key in expected) {
      if (typeof actual[key] !== typeof expected[key])
        return `${error}:\nTypes mismatch for ${key}: ${typeof actual[
          key
        ]} != ${typeof expected[key]}`;
      if (typeof expected[key] !== "object") {
        const res = matchers.toBe(actual[key], expected[key]);
        if (res)
          return `Mismatched "${key}": ${JSON.stringify(
            actual[key]
          )} != ${JSON.stringify(expected[key])}`;
        continue;
      }
      const res = matchers.toMatchObject(actual[key], expected[key]);
      if (res) return res;
    }
    return false;
  },
  toThrow: (fn: Function, expression?: RegExp): string | false => {
    try {
      fn();
      return `Expected ${fn.toString()} to throw error ${
        expression && ` matching ${expression.toString()}`
      }`;
    } catch (err) {
      if (!expression || expression.test(err.toString())) return false;
      return `Expected ${fn.toString()} to throw error ${
        expression &&
        ` matching ${expression.toString()}, but got ${err.toString()} instead`
      }`;
    }
  },
  toBeGreaterThan: (actual: any, expected: any) => {
    return actual > expected
      ? false
      : `Expected ${JSON.stringify(actual)} to be greater than ${JSON.stringify(
          expected
        )}`;
  },
  toBeGreaterThanOrEqual: (actual: any, expected: any) => {
    return actual >= expected
      ? false
      : `Expected ${JSON.stringify(
          actual
        )} to be greater than or equal ${JSON.stringify(expected)}`;
  },
  toBeLessThan: (actual: any, expected: any) => {
    return actual < expected
      ? false
      : `Expected ${JSON.stringify(actual)} to be less than ${JSON.stringify(
          expected
        )}`;
  },
  toBeLessThanOrEqual: (actual: any, expected: any) => {
    return actual <= expected
      ? false
      : `Expected ${JSON.stringify(
          actual
        )} to be less than or equal ${JSON.stringify(expected)}`;
  },
};

export function expect(
  actual: any
): Expectations & { not: Expectations } {
  const expectation: any = {
    not: {},
  };
  (Object.keys(matchers) as Array<keyof Expectations>).forEach((matcher) => {
    expectation[matcher] = (expected: any) => {
      const diff = matchers[matcher](actual, expected);
      if (diff) throw new ExpectationError(matcher, expected, actual, diff);
    };
    expectation.not[matcher] = (expected: any) => {
      const diff = matchers[matcher](actual, expected);
      if (diff === false)
        throw new ExpectationError(
          matcher,
          expected,
          actual,
          `Expected ${JSON.stringify(actual)} not ${matcher.replace(
            /[A-Z]/g,
            (letter) => ` ${letter.toLowerCase()}`
          )}${
            typeof expected !== "undefined"
              ? " " + JSON.stringify(expected)
              : ""
          }`
        );
    };
  });
  return expectation;
}


export function prettify(testResults: TestResult[]) {
  testResults.forEach(({ title, passed, skipped, error }) => {
    if (passed) return console.info("\x1b[32m", `✓ ${title}`);
    if (skipped) return console.info("\x1b[33m", `□ ${title}`);
    if (!passed)
      return console.error(
        "\x1b[31m",
        `𐄂 ${title}`,
        "\n  Failed:",
        error!.message
      );
  });
  console.log("\x1b[0m");
}

