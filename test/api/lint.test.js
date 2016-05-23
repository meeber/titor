"use strict";

var lint = require("../../api/lint");
var path = require("path");
var sh = require("shelljs");

describe("lint", function () {
  var fxtLintable = path.join(__dirname, "../fixture/resource/lintable.js");
  var binTitor = path.join(bin, "titor.js");

  afterEach(teardown);
  beforeEach(function () {
    standup();
  });

  describe("a .js file exists in src/ with a fixable issue", function () {
    var rootLintable = path.join(tmpRoot, "src/lintable.js");

    beforeEach(function () {
      sh.cp(fxtLintable, rootLintable);
    });

    it("(api) fix the issue", function () {
      lint();

      expect(sh.cat(rootLintable).stdout).to.equal("module.exports = {\n"
                                                 + "  a: 1\n"
                                                 + "};\n");
    });

    it("(bin) fix the issue", function () {
      sh.exec(binTitor + " lint");

      expect(sh.cat(rootLintable).stdout).to.equal("module.exports = {\n"
                                                 + "  a: 1\n"
                                                 + "};\n");
    });
  });

  describe("a .js file exists in build/ with a fixable issue", function () {
    var rootBuild = path.join(tmpRoot, "build");
    var rootLintable = path.join(rootBuild, "lintable.js");

    beforeEach(function () {
      sh.mkdir(rootBuild);
      sh.cp(fxtLintable, rootLintable);
    });

    it("(api) don't fix the issue", function () {
      lint();

      expect(sh.cat(rootLintable).stdout).to.equal("module.exports = {\n"
                                                 + "  a: 1,\n"
                                                 + "};\n");
    });

    it("(bin) don't fix the issue", function () {
      sh.exec(binTitor + " lint");

      expect(sh.cat(rootLintable).stdout).to.equal("module.exports = {\n"
                                                 + "  a: 1,\n"
                                                 + "};\n");
    });
  });
});
