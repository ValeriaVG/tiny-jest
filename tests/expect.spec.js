const { Test, expect } = require("../dist/index");
const test = new Test("expect");
const it = test.it;

it("toBe", () => {
  expect(1).toBe(1);
  expect(1).not.toBe("1");
  expect("1").toBe("1");
  expect("1").not.toBe(1);
  expect(undefined).toBe(undefined);
  expect(null).not.toBe(undefined);
  expect(null).toBe(null);
});
it("toEqual", () => {
  expect(0).toEqual("");
  expect("").not.toEqual("0");
});
it("toBeTruthy", () => {
  expect({}).toBeTruthy();
  expect("").not.toBeTruthy();
});
it("toBeTruthy", () => {
  expect({}).toBeTruthy();
  expect("").not.toBeTruthy();
});

it("expect.not", async () => {
  try {
    expect(2).not.toEqual(2);
    throw new Error("Should throw");
  } catch (error) {
    expect(error.message).toBe("Expected 2 not to equal 2");
  }
  try {
    expect(2).not.toBeTruthy();
    throw new Error("Should throw");
  } catch (error) {
    expect(error.message).toBe("Expected 2 not to be truthy");
  }
});
module.exports = test;
