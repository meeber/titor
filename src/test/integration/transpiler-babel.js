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

    it("minimally and recursively transpiles src/ into current-build/", () => {
      expect(cat(join(rootDir, "current-build/lib/pizza-dog.js")).stdout)
        .to.match(/exports.default = PizzaDog[\s\S]+let fleas =/);
      expect(cat(join(rootDir, "current-build/test/unit/pizza-dog.js")).stdout)
        .to.match(/_pizzaDog = require[\s\S]+let fleas =/);
    });

    it("maximally and recursively transpiles src/ into legacy-build/", () => {
      expect(cat(join(rootDir, "legacy-build/lib/pizza-dog.js")).stdout)
        .to.match(/exports.default = PizzaDog[\s\S]+var fleas =/);
      expect(cat(join(rootDir, "legacy-build/test/unit/pizza-dog.js")).stdout)
        .to.match(/_pizzaDog = require[\s\S]+var fleas =/);
    });

    it("creates source maps 

    after(teardown);
  });
});
