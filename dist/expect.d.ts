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
export declare type SyncExpectationResult = {
    pass: boolean;
    message(): string;
};
export interface Context {
    isNot: boolean;
}
export declare type Matcher = (ctx: Context, actual: any, expected: any) => {
    pass: boolean;
    message: () => string;
};
declare function expect(actual: any): Expectations & {
    not: Expectations;
};
declare namespace expect {
    var extend: (extensions: Record<string, Expectation<any>>) => void;
}
export default expect;
