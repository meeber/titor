"use strict";

var createResource = require("../../util/create-resource");
var path = require("path");
var sh = require("shelljs");

describe("createResource", function () {
  afterEach(function () { teardown() });
  beforeEach(function () { standup() });

  describe("no file already exists at dstPath", function () {
    var dstPath = path.join(tmpRoot, ".titorrc.yml");

    it("create file at dstPath", function () {
      createResource(".titorrc.yml");

      expect(sh.test("-e", dstPath)).to.be.true;
    });

    it("return true", function () {
      expect(createResource(".titorrc.yml")).to.be.true;
    });
  });

  describe("a file already exists at dstPath", function () {
    var dstPath = path.join(tmpRoot, ".titorrc.yml");

    beforeEach(function () { sh.ShellString("testing").to(dstPath) });

    it("don't replace existing file at dstPath", function () {
      createResource(".titorrc.yml");

      expect(sh.cat(dstPath).stdout).to.equal("testing");
    });

    it("return false", function () {
      expect(createResource(".titorrc.yml")).to.be.false;
    });
  });

  describe("pkgExport is undefined", function () {
    it("don't replace PACKAGE_EXPORT with pkgExport in dst file", function () {
      var dstPath = path.join(tmpRoot, ".titorrc.yml");

      createResource(".titorrc.yml");

      expect(sh.grep("export", dstPath).stdout.trim())
        .to.equal("export: PACKAGE_EXPORT");
    });
  });

  describe("pkgExport is defined", function () {
    it("replace PACKAGE_EXPORT with pkgExport in dst file", function () {
      var dstPath = path.join(tmpRoot, ".titorrc.yml");

      createResource(".titorrc.yml", "testPackage");

      expect(sh.grep("export", dstPath).stdout.trim())
        .to.equal("export: testPackage");
    });
  });

  describe("srcPath is undefined", function () {
    it("copy src file from default path to dstPath", function () {
      var dstPath = path.join(tmpRoot, ".titorrc.yml");
      var srcPath = path.join(__dirname, "../../resource/_.titorrc.yml");

      createResource(".titorrc.yml");

      expect(sh.cat(dstPath).stdout).to.equal(sh.cat(srcPath).stdout);
    });
  });

  describe("srcPath is defined", function () {
    it("copy src file from srcPath to dstPath", function () {
      var dstPath = path.join(tmpRoot, "src/testPackage.js");
      var srcPath = path.join(
        __dirname,
        "../../resource/src/_package-export.js"
      );

      createResource("src/testPackage.js", undefined, srcPath);

      expect(sh.cat(dstPath).stdout).to.equal(sh.cat(srcPath).stdout);
    });
  });
});
