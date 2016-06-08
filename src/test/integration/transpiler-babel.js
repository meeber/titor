import {expect} from "chai";
import {join} from "path";
import {transpile} from "../../lib/transpiler-babel";
import {cat, cp, test} from "../../lib/sh";
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

      await transpile();
    });

    describe("current build", () => {
      const buildDir = join(rootDir, "current-build");

      it("minimally transpile src/ into current-build/", () => {
        expect(cat(join(buildDir, "lib/pizza-dog.js")).stdout)
          .to.match(/exports.default = PizzaDog[\s\S]+let fleas =/);
      });

      it("recursively transpiles src/ into current-build/", () => {
        expect(test("-e", join(buildDir, "test/unit/pizza-dog.js"))).to.be.true;
      });

      it("creates source map files for current-build", () => {
        expect(test("-e", join(buildDir, "lib/pizza-dog.js.map"))).to.be.true;
      });
    });

    describe("legacy build", () => {
      const buildDir = join(rootDir, "legacy-build");

      it("maximally transpiles src/ into legacy-build/", () => {
        expect(cat(join(buildDir, "lib/pizza-dog.js")).stdout)
          .to.match(/exports.default = PizzaDog[\s\S]+var fleas =/);
      });

      it("recursively transpiles src/ into legacy-build/", () => {
        expect(test("-e", join(buildDir, "test/unit/pizza-dog.js"))).to.be.true;
      });

      it("creates source map files for legacy-build", () => {
        expect(test("-e", join(buildDir, "lib/pizza-dog.js.map"))).to.be.true;
      });
    });

    after(teardown);
  });
});
