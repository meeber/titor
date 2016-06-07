import {expect} from "chai";
import {join} from "path";
import TranspilerBabel from "../../lib/transpiler-babel";
import {cat, cp} from "../../lib/sh";
import {rootDir, standup, teardown} from "../util/fixture";

describe("TranspilerBabel", () => {
  describe("run in a directory containing a basic src directory", () => {
    before(async () => {
      standup();

      cp(
        join(__dirname, "../../../asset/_.babelrc"),
        join(rootDir, ".babelrc"),
      );

      cp(
        "-r",
        join(__dirname, "../../../asset/fixture/_src"),
        join(rootDir, "src"),
      );

      await TranspilerBabel().run();
    });

    it("minimally transpiles src/lib into current-build", () => {
      expect(cat(join(rootDir, "current-build/lib/pizza-dog.js")).stdout)
        .to.match(/exports.default = PizzaDog[\s\S]+let fleas =/);
    });

    it("minimally transpiles src/test/unit into current-build", () => {
      expect(cat(join(rootDir, "current-build/test/unit/pizza-dog.js")).stdout)
        .to.match(/_pizzaDog = require[\s\S]+let fleas =/);
    });

    it("maximally transpiles src/lib into legacy-build", () => {
      expect(cat(join(rootDir, "legacy-build/lib/pizza-dog.js")).stdout)
       .to.match(/exports.default = PizzaDog[\s\S]+var fleas =/);
    });

    it("maximally transpiles src/test/unit into legacy-build", () => {
      expect(cat(join(rootDir, "legacy-build/test/unit/pizza-dog.js")).stdout)
        .to.match(/_pizzaDog = require[\s\S]+var fleas =/);
    });

    after(teardown);
  });
});
