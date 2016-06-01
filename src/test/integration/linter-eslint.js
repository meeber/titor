import chai from "chai";
import LinterEslint from "../../lib/linter-eslint";
import sh from "shelljs";
import {join} from "path";
import {rootDir, standup, teardown} from "../util/fixture";

let expect = chai.expect;

sh.execAsync = function execAsync (cmd) {
  return new Promise((resolve, reject) => {
    sh.exec(cmd, (code, stdout, stderr) => {
      let details = {cmd, code, stdout, stderr};

      if (code) reject(Object.assign(Error("Script error"), details));
      else resolve(details);
    });
  });
};

describe("linterEslint", () => {
  describe("run in a directory containing a file with linting errors", () => {
    let err;

    before(async function () {
      standup();

      sh.cp(
        join(__dirname, "../../../asset/_.eslintrc.yml"),
        join(rootDir, ".eslintrc.yml"),
      );

      sh.cp(
        join(__dirname, "../../../asset/fixture/_lint-errors.js"),
        join(rootDir, "lint-errors.js"),
      );
      
      try {
        await LinterEslint(sh).run();
      } catch (e) {
        err = e;
      }
    });

    it("return a promise that rejects with unfixable linting error", () => {
      expect(err.stdout).to.match(/'unusedVar' is defined but never used/)
    });

    it("fix fixable linting error", () => {
      expect(sh.cat(join(rootDir, "lint-errors.js")).stdout)
        .to.equal("let unusedVar;\n");
    });

    after(teardown);
  });
});
