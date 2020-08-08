const { performance } = require("perf_hooks");
const { Test, expect, prettify } = require("../dist/index");

const { it, run, title } = new Test("node-tiny-jest");

it("toBe", () => {
  expect(2 + 2).toBe(4);
  expect(2 + 2).not.toBe(5);
});

it("toEqual", () => {
  expect(2 + 2).toEqual("4");
  expect(2 + 2).not.toEqual("5");
});

it("toBeTruthy", () => {
  expect(0).toBeFalsy();
  expect(1).not.toBeFalsy();
});

it("toBeFalsy", () => {
  expect(1).toBeTruthy();
});

it("toMatchObject", () => {
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
  expect({
    givenName: "John",
    familyName: "Doe",
  }).not.toMatchObject({
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
