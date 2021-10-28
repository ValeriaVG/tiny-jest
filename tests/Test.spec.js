const { Test, expect } = require("../dist/index");
const test = new Test("Test");

test.it("properly runs tests", async () => {
  const tmp = new Test("tmp-test");
  tmp.before(() => {
    console.log("Before test");
  });
  tmp.after(() => {
    console.log("After test");
  });
  tmp.it("passed", () => {});
  tmp.it("failed", () => {
    throw new Error("failed");
  });
  tmp.xit("skipped", () => {
    throw new Error("failed");
  });
  tmp.it("todo");
  const result = await tmp.run();
  expect(result).toMatchObject([
    { title: "passed", passed: true },
    { title: "failed", passed: false, error: new Error("failed") },
    { title: "skipped", skipped: true, passed: undefined },
    { title: "todo", skipped: true },
  ]);
});

module.exports = test;
