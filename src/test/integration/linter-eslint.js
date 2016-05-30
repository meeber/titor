import chai from "chai";
import LinterEslint from "../../lib/linter-eslint";
import path from "path";
import sh from "shelljs";
import {rootDir, standup, teardown} from "../util/fixture";

let expect = chai.expect;

describe("linterEslint", () => {
  describe("run in a directory containing a file with linting errors", () => {
    let result;

    before(() => {
      standup();

      sh.cp(
        path.join(__dirname, "../../../asset/_.eslintrc.yml"),
        path.join(rootDir, ".eslintrc.yml"),
      );

      sh.cp(
        path.join(__dirname, "../../../asset/fixture/_lint-errors.js"),
        path.join(rootDir, "lint-errors.js"),
      );

      result = LinterEslint(sh).run();
    });

    it("report unfixable linting error", () => {
      expect(result.stdout).to.match(/'unusedVar' is defined but never used/);
    });

    it("fix fixable linting error", () => {
      expect(sh.cat(path.join(rootDir, "lint-errors.js")).stdout)
        .to.equal("let unusedVar;\n");
    });

    after(teardown);
  });
});
