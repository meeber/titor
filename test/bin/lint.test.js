"use strict";

var path = require("path");
var sh = require("shelljs");

var binTitorJs = path.join(__dirname, "../../bin/titor.js");
var fxtBuild = path.join(fxt, "build");
var fxtBuildLintable = path.join(fxtBuild, "lintable.js");
var fxtSrcLintable = path.join(fxt, "src/lintable.js");
var rscLintable = path.join(__dirname, "../fixture/resource/lintable.js");

describe("lint (bin)", function () {
  describe("a .js file exists in src/ with a fixable issue", function () {
    before(function () {
      standup();

      sh.cp(rscLintable, fxtSrcLintable);

      sh.exec(binTitorJs + " lint");
    });

    it("fix the issue", function () {
      expect(sh.cat(fxtSrcLintable).stdout).to.equal("module.exports = {\n"
                                                   + "  a: 1\n"
                                                   + "};\n");
    });

    after(teardown);
  });

  describe("a .js file exists in build/ with a fixable issue", function () {
    before(function () {
      standup();

      sh.mkdir(fxtBuild);
      sh.cp(rscLintable, fxtBuildLintable);

      sh.exec(binTitorJs + " lint");
    });

    it("don't fix the issue", function () {
      expect(sh.cat(fxtBuildLintable).stdout).to.equal("module.exports = {\n"
                                                     + "  a: 1,\n"
                                                     + "};\n");
    });

    after(teardown);
  });
});
