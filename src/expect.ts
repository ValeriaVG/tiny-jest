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
export type SyncExpectationResult = {
  pass: boolean;
  message(): string;
};

export interface Context {
  isNot: boolean
}

export type Matcher = (ctx: Context, actual: any, expected: any) => { pass: boolean, message: () => string };

const matchers: Record<keyof Expectations, Matcher> = {
  toBe: (ctx: Context, actual: any, expected: any) => {
    return {
      pass: expected === actual,
      message: () => `Expected ${JSON.stringify(actual)}${ctx.isNot ? ' not' : ''} to be ${JSON.stringify(expected)}`
    };
  },
  toEqual: (ctx: Context, actual: any, expected: any) => {
    return {
      pass: expected == actual, message: () => `Expected ${JSON.stringify(actual)}${ctx.isNot ? ' not' : ''} to equal ${JSON.stringify(
        expected
      )}`
    };
  },
  toBeTruthy: (ctx: Context, actual: any) => {
    return { pass: !!actual, message: () => `Expected ${JSON.stringify(actual)}${ctx.isNot ? ' not' : ''} to be truthy` };
  },
  toBeFalsy: (ctx: Context, actual: any) => {
    return { pass: !actual, message: () => `Expected ${JSON.stringify(actual)}${ctx.isNot ? ' not' : ''} to be falsy` };
  },
  toMatchObject: (ctx: Context, actual: any, expected: any) => {
    const error = `Expected ${JSON.stringify(actual)}${ctx.isNot ? ' not' : ''} to match ${JSON.stringify(
      expected
    )}`;
    if (
      typeof actual !== typeof expected ||
      Array.isArray(actual) !== Array.isArray(expected)
    )
      return { pass: false, message: () => error };

    for (let key in expected) {
      if (typeof actual[key] !== typeof expected[key])
        return {
          pass: false, message: () => `${error}:\nTypes mismatch for ${key}: ${typeof actual[
            key
          ]} != ${typeof expected[key]}`
        };
      if (typeof expected[key] !== "object") {
        const res = matchers.toBe(ctx, actual[key], expected[key]);
        if (!res.pass)
          return {
            pass: false, message: () => `${error}: Mismatched "${key}": ${JSON.stringify(
              actual[key]
            )} != ${JSON.stringify(expected[key])}`
          };
        continue;
      }
      const res = matchers.toMatchObject(ctx, actual[key], expected[key]);
      if (!res.pass) return res;
    }
    return { pass: true, message: () => error };
  },
  toThrow: (ctx: Context, fn: Function, expression?: RegExp) => {
    const error = `Expected ${fn.toString()}${ctx.isNot ? ' not' : ''} to throw error ${expression && ` matching ${expression.toString()}`}`;
    try {
      fn();
      return {
        pass: false, message: () => error
      };
    } catch (err) {
      if (!expression || expression.test(err.toString())) return { pass: true, message: () => error };
      return {
        pass: false, message: () => `Expected ${fn.toString()}${ctx.isNot ? ' not' : ''} to throw error ${expression &&
          ` matching ${expression.toString()}, but got ${err.toString()} instead`
          }`
      };
    }
  },
  toBeGreaterThan: (ctx: Context, actual: any, expected: any) => {
    return {
      pass: actual > expected, message: () => `Expected ${JSON.stringify(actual)}${ctx.isNot ? ' not' : ''} to be greater than ${JSON.stringify(
        expected
      )}`
    };
  },
  toBeGreaterThanOrEqual: (ctx: Context, actual: any, expected: any) => {
    return {
      pass: actual >= expected, message: () => `Expected ${JSON.stringify(
        actual
      )}${ctx.isNot ? ' not' : ''} to be greater than or equal ${JSON.stringify(expected)}`
    };
  },
  toBeLessThan: (ctx: Context, actual: any, expected: any) => {
    return {
      pass: actual < expected, message: () => `Expected ${JSON.stringify(actual)}${ctx.isNot ? ' not' : ''} to be less than ${JSON.stringify(
        expected
      )}`
    };
  },
  toBeLessThanOrEqual: (ctx: Context, actual: any, expected: any) => {
    return {
      pass: actual <= expected, message: () => `Expected ${JSON.stringify(
        actual
      )}${ctx.isNot ? ' not' : ''} to be less than or equal ${JSON.stringify(expected)}`
    };
  }
};

export default function expect(
  actual: any
): Expectations & { not: Expectations } {
  const expectation: any = {
    not: {},
  };
  (Object.keys(matchers) as Array<keyof Expectations>).forEach((matcher) => {
    expectation[matcher] = (expected: any) => {
      const result = matchers[matcher]({ isNot: false }, actual, expected);
      if (!result.pass)
        throw new ExpectationError(matcher, expected, actual, result.message());
    };
    expectation.not[matcher] = (expected: any) => {
      const result = matchers[matcher]({ isNot: true }, actual, expected);
      if (result.pass)
        throw new ExpectationError(
          matcher,
          expected,
          actual,
          result.message()
        );
    };
  });
  return expectation;
}

expect.extend = (extensions: Record<string, Expectation<any>>) => {
  Object.assign(matchers, extensions)
}