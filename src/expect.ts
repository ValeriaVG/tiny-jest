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

export default function expect(
  actual: any
): Expectations & { not: Expectations } {
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
