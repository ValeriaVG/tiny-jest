export declare class ExpectationError extends Error {
    extensions: {
        matcher: string;
        expected: any;
        actual: any;
    };
    constructor(matcher: string, expected: any, actual: any, diff: string);
}
export declare type Expectation<T> = (expected: T) => void;
export declare type Expectations = {
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
export declare type Matcher = (actual: any, expected: any) => false | string;
export default function expect(actual: any): Expectations & {
    not: Expectations;
};
