export declare type TestResult = {
    title: string;
    skipped?: boolean;
    passed?: boolean;
    error?: Error;
};
export declare type FixtureFn = () => Promise<void> | void;
export default class Test {
    title: string;
    suite: {
        title: string;
        fn?: Function;
    }[];
    results: TestResult[];
    private _before;
    private _after;
    constructor(title?: string);
    it: (title: string, fn?: Function) => void;
    xit: (title: string, _fn?: Function) => void;
    run: () => Promise<TestResult[]>;
    before: (fn: FixtureFn) => void;
    after: (fn: FixtureFn) => void;
}
