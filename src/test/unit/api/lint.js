"use strict";

const {lint} = require("../../../api");

describe("(api) lint", () => {
  describe("linter is valid", () => {
    const linter = {lint: () => Promise.resolve(42)};

    let result;

    before(async () => {
      result = await lint(linter);
    });

    it("returns result of running linter's .lint", () => {
      expect(result).to.equal(42);
    });
  });

  describe("linter lacks .lint", () => {
    const linter = {};

    let err;

    before(async () => {
      try {
        await lint(linter);
      } catch (e) {
        err = e;
      }
    });

    it("throws error", () => {
      expect(err.message).to.equal("linter.lint is not a function");
    });
  });
});
