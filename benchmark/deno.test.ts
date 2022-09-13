//@ts-ignore
import { Test, expect, prettify } from "../dist/mod.ts";
const { it, run, title, before, after } = new Test("deno-tiny-jest");

after(() => console.log("After test"));
before(() => console.log("Before test"));
it("works", () => {
  console.log("During test");
});

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
it("toThrow", () => {
  expect(() => {
    throw "Error";
  }).toThrow();
  expect(() => { }).not.toThrow();
  expect(() => {
    throw "Not Found";
  }).toThrow(/not found/gi);
  expect(() => {
    throw "Not Found";
  }).not.toThrow(/server error/gi);
});

it("toBeGreater/Less", () => {
  expect(5).toBeGreaterThan(3);
  expect(3).toBeLessThan(5);
  expect(4).toBeGreaterThanOrEqual(3);
  expect(4).toBeGreaterThanOrEqual(4);
  expect(3).not.toBeLessThan(2);
});

it("extend", () => {
  expect.extend({
    toBeEvenlyDividableBy: (ctx, actual, divisor) => {
      return {
        pass: actual % divisor == 0, message: () => `Expected ${JSON.stringify(actual)}${ctx.isNot ? 'not' : ''} to be less dividable by ${JSON.stringify(
          divisor
        )}`
      }
    }
  })
  expect(5).toBeEvenlyDividableBy(5);
  expect(4).toBeEvenlyDividableBy(2);
  expect(7).not.toBeEvenlyDividableBy(2);
});

const start = performance.now();
run()
  .then((results) => {
    const end = performance.now();
    console.log(title, end - start, "ms");
    return results;
  })
  .then(prettify);
