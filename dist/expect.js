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
    toBe: (actual, expected) => {
        return expected === actual
            ? false
            : `Expected ${JSON.stringify(actual)} to be ${JSON.stringify(expected)}`;
    },
    toEqual: (actual, expected) => {
        return expected == actual
            ? false
            : `Expected ${JSON.stringify(actual)} to equal ${JSON.stringify(expected)}`;
    },
    toBeTruthy: (actual) => {
        return actual ? false : `Expected ${JSON.stringify(actual)} to be truthy`;
    },
    toBeFalsy: (actual) => {
        return actual ? `Expected ${JSON.stringify(actual)} to be falsy` : false;
    },
    toMatchObject: (actual, expected) => {
        for (let key in expected) {
            if (typeof actual[key] !== typeof expected[key])
                return `Types mismatch for ${key}: ${typeof actual[key]} != ${typeof expected[key]}`;
            if (typeof expected[key] !== "object") {
                const res = matchers.toBe(actual[key], expected[key]);
                if (res)
                    return `Mismatched "${key}": ${JSON.stringify(actual[key])} != ${JSON.stringify(expected[key])}`;
                continue;
            }
            const res = matchers.toMatchObject(actual[key], expected[key]);
            if (res)
                return res;
        }
        return false;
    },
};
function expect(actual) {
    const expectation = {
        not: {},
    };
    Object.keys(matchers).forEach((matcher) => {
        expectation[matcher] = (expected) => {
            const diff = matchers[matcher](actual, expected);
            if (diff)
                throw new ExpectationError(matcher, expected, actual, diff);
        };
        expectation.not[matcher] = (expected) => {
            const diff = matchers[matcher](actual, expected);
            if (diff === false)
                throw new ExpectationError(matcher, expected, actual, `Expected ${JSON.stringify(actual)} not ${matcher.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}${typeof expected !== "undefined"
                    ? " " + JSON.stringify(expected)
                    : ""}`)}`);
        };
    });
    return expectation;
}
exports.default = expect;
