export declare class ExpectationError extends Error {
    extensions: {
        matcher: string;
        expected: any;
        actual: any;
    };
    constructor(matcher: string, expected: any, actual: any, diff: string);
}
export declare type Expectation<T> = (expected: T) => void;
export declare type JustExpectation = () => void;
export declare type Expectations = {
    toBe: Expectation<any>;
    toEqual: Expectation<any>;
    toBeTruthy: JustExpectation;
    toBeFalsy: JustExpectation;
    toMatchObject: Expectation<Object>;
};
export declare type Matcher = (actual: any, expected: any) => false | string;
export default function expect(actual: any): Expectations & {
    not: Expectations;
};
