export type TestResult = {
  title: string;
  skipped?: boolean;
  passed?: boolean;
  error?: Error;
};

export type FixtureFn = () => Promise<void> | void;
export default class Test {
  title?: string;
  suite: { title: string; fn?: Function }[] = [];
  // Stores last results
  results: TestResult[] = [];
  private _before: FixtureFn[] = [];
  private _after: FixtureFn[] = [];
  constructor(title?: string) {
    this.title = title;
  }
  it = (title: string, fn?: Function) => {
    this.suite.push({ title, fn });
  };
  xit = (title: string, _fn?: Function) => {
    this.suite.push({ title });
  };
  run = async () => {
    this.results = [];
    try {
      await Promise.all(this._before.map((fn) => fn()));
    } catch (error) {
      return [{ title: this.title, error, passed: false }];
    }
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
    try {
      await Promise.all(this._after.map((fn) => fn()));
    } catch (error) {
      console.error(error);
    }
    return this.results;
  };
  before = (fn: FixtureFn) => {
    this._before.push(fn);
  };
  after = (fn: FixtureFn) => {
    this._after.push(fn);
  };
}
