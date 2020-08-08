export type TestResult = {
  title: string;
  skipped?: boolean;
  passed?: boolean;
  error?: Error;
};
export default class Test {
  title?: string;
  private suite: { title: string; fn?: Function }[] = [];
  // Stores last results
  private results: TestResult[] = [];
  constructor(title?: string) {
    this.title = title;
  }
  it = (title: string, fn?: Function) => {
    this.suite.push({ title, fn });
  };
  xit = (title: string, fn?: Function) => {
    this.suite.push({ title });
  };
  run = async () => {
    this.results = [];
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
    return this.results;
  };
}
