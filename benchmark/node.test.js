const { performance } = require("perf_hooks");
const { Test, expect, prettify } = require("../dist/index");

const { it, run, title } = new Test("node-tiny-jest");

it("2+2=4", () => {
  expect(2 + 2).toBe(4);
});

it("2+1=4", () => {
  expect(2 + 1).toBe(4);
});

it("2+1!=4", () => {
  expect(2 + 1).not.toBe(4);
});

it("1 is truthy", () => {
  expect(1).toBeTruthy();
});

it("0 is truthy", () => {
  expect(0).toBeTruthy();
});

it("0 is not truthy", () => {
  expect(0).not.toBeTruthy();
});

it("compares objects", () => {
  expect({ name: "John Doe" }).toMatchObject({ name: "John Doe" });
});

it("compares objects", () => {
  expect({ name: "John Doe" }).toMatchObject({ name: "Jane Doe" });
});

it("compares partial objects", () => {
  expect({
    fullName: {
      givenName: "John",
      familyName: "Doe",
    },
  }).toMatchObject({
    fullName: {
      givenName: "John",
    },
  });
});

const start = performance.now();
run()
  .then((results) => {
    const end = performance.now();
    console.log(title, end - start, "ms");
    return results;
  })
  .then(prettify);
