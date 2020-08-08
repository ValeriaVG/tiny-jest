export class ExpectationError extends Error {
  extensions: { matcher: string; expected: any; actual: any };
  constructor(matcher: string, expected: any, actual: any, diff: string) {
    super(diff);
    this.extensions = { matcher, expected, actual };
  }
}

export type Expectation<T> = (expected: T) => void;
export type JustExpectation = () => void;
export type Expectations = {
  toBe: Expectation<any>;
  toEqual: Expectation<any>;
  toBeTruthy: JustExpectation;
  toBeFalsy: JustExpectation;
  toMatchObject: Expectation<Object>;
};

export type Matcher = (actual: any, expected: any) => false | string;

const matchers: { [key: string]: Matcher } = {
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
    for (let key in expected) {
      if (typeof actual[key] !== typeof expected[key])
        return `Types mismatch for ${key}: ${typeof actual[
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
};

export function expect(actual: any): Expectations & { not: Expectations } {
  const expectation: any = {
    not: {},
  };
  Object.keys(matchers).forEach((matcher) => {
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
            (letter) =>
              `_${letter.toLowerCase()}${
                typeof expected !== "undefined"
                  ? " " + JSON.stringify(expected)
                  : ""
              }`
          )}`
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

export type TestResult = {
  title: string;
  skipped?: boolean;
  passed?: boolean;
  error?: Error;
};
export class Test {
  title?: string;
  private suite: { title: string; fn?: Function }[] = [];
  // Stores last results
  private results: TestResult[] = [];
  constructor(title?: string) {
    this.title = title;
  }
  it = (title: string, fn?: Function) => {
    this.suite.push({ title, fn });
  };
  xit = (title: string, fn?: Function) => {
    this.suite.push({ title });
  };
  run = async () => {
    this.results = [];
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
    return this.results;
  };
}
