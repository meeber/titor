import {expect} from "chai";
import {join} from "path";
import LinterEslint from "../../lib/linter-eslint";
import {cat, cp} from "../../lib/sh";
import {rootDir, standup, teardown} from "../util/fixture";

describe("linterEslint", () => {
  describe("run in a directory containing a file with linting errors", () => {
    let err;

    before(async () => {
      standup();

      cp(
        join(__dirname, "../../../asset/_.eslintrc.yml"),
        join(rootDir, ".eslintrc.yml"),
      );

      cp(
        join(__dirname, "../../../asset/fixture/_lint-errors.js"),
        join(rootDir, "lint-errors.js"),
      );

      try {
        await LinterEslint().run();
      } catch (e) {
        err = e;
      }
    });

    it("return a promise that rejects with unfixable linting error", () => {
      expect(err.stdout).to.match(/'unusedVar' is defined but never used/);
    });

    it("fix fixable linting error", () => {
      expect(cat(join(rootDir, "lint-errors.js")).stdout)
        .to.equal("let unusedVar;\n");
    });

    after(teardown);
  });
});
