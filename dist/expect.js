"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpectationError = void 0;
class ExpectationError extends Error {
    constructor(matcher, expected, actual, diff) {
        super(diff);
        this.extensions = { matcher, expected, actual };
    }
}
exports.ExpectationError = ExpectationError;
const matchers = {
    toBe: (ctx, actual, expected) => {
        return {
            pass: expected === actual,
            message: () => `Expected ${JSON.stringify(actual)}${ctx.isNot ? ' not' : ''} to be ${JSON.stringify(expected)}`
        };
    },
    toEqual: (ctx, actual, expected) => {
        return {
            pass: expected == actual, message: () => `Expected ${JSON.stringify(actual)}${ctx.isNot ? ' not' : ''} to equal ${JSON.stringify(expected)}`
        };
    },
    toBeTruthy: (ctx, actual) => {
        return { pass: !!actual, message: () => `Expected ${JSON.stringify(actual)}${ctx.isNot ? ' not' : ''} to be truthy` };
    },
    toBeFalsy: (ctx, actual) => {
        return { pass: !actual, message: () => `Expected ${JSON.stringify(actual)}${ctx.isNot ? ' not' : ''} to be falsy` };
    },
    toMatchObject: (ctx, actual, expected) => {
        const error = `Expected ${JSON.stringify(actual)}${ctx.isNot ? ' not' : ''} to match ${JSON.stringify(expected)}`;
        if (typeof actual !== typeof expected ||
            Array.isArray(actual) !== Array.isArray(expected))
            return { pass: false, message: () => error };
        for (let key in expected) {
            if (typeof actual[key] !== typeof expected[key])
                return {
                    pass: false, message: () => `${error}:\nTypes mismatch for ${key}: ${typeof actual[key]} != ${typeof expected[key]}`
                };
            if (typeof expected[key] !== "object") {
                const res = matchers.toBe(ctx, actual[key], expected[key]);
                if (!res.pass)
                    return {
                        pass: false, message: () => `${error}: Mismatched "${key}": ${JSON.stringify(actual[key])} != ${JSON.stringify(expected[key])}`
                    };
                continue;
            }
            const res = matchers.toMatchObject(ctx, actual[key], expected[key]);
            if (!res.pass)
                return res;
        }
        return { pass: true, message: () => error };
    },
    toThrow: (ctx, fn, expression) => {
        const error = `Expected ${fn.toString()}${ctx.isNot ? ' not' : ''} to throw error ${expression && ` matching ${expression.toString()}`}`;
        try {
            fn();
            return {
                pass: false, message: () => error
            };
        }
        catch (err) {
            if (!expression || expression.test(err.toString()))
                return { pass: true, message: () => error };
            return {
                pass: false, message: () => `Expected ${fn.toString()}${ctx.isNot ? ' not' : ''} to throw error ${expression &&
                    ` matching ${expression.toString()}, but got ${err.toString()} instead`}`
            };
        }
    },
    toBeGreaterThan: (ctx, actual, expected) => {
        return {
            pass: actual > expected, message: () => `Expected ${JSON.stringify(actual)}${ctx.isNot ? ' not' : ''} to be greater than ${JSON.stringify(expected)}`
        };
    },
    toBeGreaterThanOrEqual: (ctx, actual, expected) => {
        return {
            pass: actual >= expected, message: () => `Expected ${JSON.stringify(actual)}${ctx.isNot ? ' not' : ''} to be greater than or equal ${JSON.stringify(expected)}`
        };
    },
    toBeLessThan: (ctx, actual, expected) => {
        return {
            pass: actual < expected, message: () => `Expected ${JSON.stringify(actual)}${ctx.isNot ? ' not' : ''} to be less than ${JSON.stringify(expected)}`
        };
    },
    toBeLessThanOrEqual: (ctx, actual, expected) => {
        return {
            pass: actual <= expected, message: () => `Expected ${JSON.stringify(actual)}${ctx.isNot ? ' not' : ''} to be less than or equal ${JSON.stringify(expected)}`
        };
    }
};
function expect(actual) {
    const expectation = {
        not: {},
    };
    Object.keys(matchers).forEach((matcher) => {
        expectation[matcher] = (expected) => {
            const result = matchers[matcher]({ isNot: false }, actual, expected);
            if (!result.pass)
                throw new ExpectationError(matcher, expected, actual, result.message());
        };
        expectation.not[matcher] = (expected) => {
            const result = matchers[matcher]({ isNot: true }, actual, expected);
            if (result.pass)
                throw new ExpectationError(matcher, expected, actual, result.message());
        };
    });
    return expectation;
}
exports.default = expect;
expect.extend = (extensions) => {
    Object.assign(matchers, extensions);
};
