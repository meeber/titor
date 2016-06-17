"use strict";

const {join} = require("path");
const {cat, cd, cp, exec} = require("../../../lib/sh");
const {rootDir, standup, teardown} = require("../../fixture");

describe("(bin) lint with LinterEslint", () => {
  describe("run in a directory containing a file with linting errors", () => {
    let err;

    before(async () => {
      standup();

      cp(
        join(__dirname, "../../../../asset/_.eslintrc.yml"),
        join(rootDir, ".eslintrc.yml"),
      );

      cp(
        join(__dirname, "../../../../asset/fixture/_lint-errors.js"),
        join(rootDir, "lint-errors.js"),
      );

      cd(rootDir);

      try {
        exec(`${join(__dirname, "../../../bin/titor.js")} lint`);
      } catch (e) {
        err = e;
      }
    });

    it("terminates with exit code -1", () => {
      expect(err.code).to.equal(-1);
    });

    it("outputs unfixable linting error to stdout", () => {
      expect(err.stdout).to.match(/'unusedVar' is defined but never used/);
    });

    it("fixes fixable linting error", () => {
      expect(cat(join(rootDir, "lint-errors.js")).stdout)
        .to.equal("let unusedVar;\n");
    });

    after(teardown);
  });
});
