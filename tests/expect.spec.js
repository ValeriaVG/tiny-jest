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
it("toThrow", () => {
  expect(() => {
    throw "Error";
  }).toThrow();
  expect(() => {}).not.toThrow();
  expect(() => {
    throw "Not Found";
  }).toThrow(/not found/gi);
  expect(() => {
    throw "Not Found";
  }).not.toThrow(/server error/gi);
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

it("toMatchObject", () => {
  const more = { a: 1, b: 2, c: 3 };
  const less = { a: 1, b: 2 };
  expect(more).toMatchObject(more);
  expect(less).toMatchObject(less);

  expect(more).toMatchObject(less);
  expect(less).not.toMatchObject(more);
});

it("toMatchObject/arrays", () => {
  expect([]).toMatchObject([]);
  expect([]).not.toMatchObject({});
  expect([1, 2, 3]).toMatchObject([1, 2]);
  expect([2, 3]).not.toMatchObject([1, 2, 3]);
  expect([{ id: 1, name: "1" }, { id: 2, name: "2" }, { id: 3 }]).toMatchObject(
    [{ id: 1 }, { id: 2 }, { id: 3 }]
  );
  expect([{ id: 1 }, { id: 2 }, { id: 3 }]).not.toMatchObject([
    { id: 1, name: "1" },
    { id: 2, name: "2" },
    { id: 3 },
  ]);
  expect({ a: [1, 2, 3] }).toMatchObject({ a: [1, 2, 3] });
  expect({ a: [1, 2] }).not.toMatchObject({ a: [1, 2, 3] });
});
module.exports = test;
