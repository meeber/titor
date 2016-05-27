"use strict";

var path = require("path");
var sh = require("shelljs");
var titor = require("../../api/titor");

var fxtBuild = path.join(fxt, "build");
var fxtBuildLintable = path.join(fxtBuild, "lintable.js");
var fxtSrcLintable = path.join(fxt, "src/lintable.js");
var rscLintable = path.join(__dirname, "../fixture/resource/lintable.js");

describe("lint (api)", function () {
  describe("a .js file exists in src/ with a fixable issue", function () {
    before(function () {
      standup();

      sh.cp(rscLintable, fxtSrcLintable);

      titor.lint();
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

      titor.lint();
    });

    it("don't fix the issue", function () {
      expect(sh.cat(fxtBuildLintable).stdout).to.equal("module.exports = {\n"
                                                     + "  a: 1,\n"
                                                     + "};\n");
    });

    after(teardown);
  });
});
