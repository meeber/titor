import {expect} from "chai";
import {join} from "path";
import TranspilerBabel from "../../lib/transpiler-babel";
import {cat, cp, test} from "../../lib/sh";
import {rootDir, standup, teardown} from "../util/fixture";

const curBldDir = join(rootDir, "current-build");
const legBldDir = join(rootDir, "legacy-build");

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
      expect(cat(join(curBldDir, "lib/pizza-dog.js")).stdout)
        .to.match(/exports.default = PizzaDog[\s\S]+let fleas =/);
      expect(cat(join(curBldDir, "test/unit/pizza-dog.js")).stdout)
        .to.match(/_pizzaDog = require[\s\S]+let fleas =/);
    });

    it("maximally and recursively transpiles src/ into legacy-build/", () => {
      expect(cat(join(legBldDir, "lib/pizza-dog.js")).stdout)
        .to.match(/exports.default = PizzaDog[\s\S]+var fleas =/);
      expect(cat(join(legBldDir, "test/unit/pizza-dog.js")).stdout)
        .to.match(/_pizzaDog = require[\s\S]+var fleas =/);
    });

    it("creates source map files for all transpiled scripts", () => {
      expect(test("-e", join(curBldDir, "lib/pizza-dog.js.map"))).to.be.true;
      expect(test("-e", join(curBldDir, "test/unit/pizza-dog.js.map")))
        .to.be.true;
      expect(test("-e", join(legBldDir, "lib/pizza-dog.js.map"))).to.be.true;
      expect(test("-e", join(legBldDir, "test/unit/pizza-dog.js.map")))
        .to.be.true;
    });

    after(teardown);
  });
});
