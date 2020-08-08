export declare type TestResult = {
    title: string;
    skipped?: boolean;
    passed?: boolean;
    error?: Error;
};
export default class Test {
    title?: string;
    private suite;
    private results;
    constructor(title?: string);
    it: (title: string, fn?: Function) => void;
    xit: (title: string, fn?: Function) => void;
    run: () => Promise<TestResult[]>;
}
