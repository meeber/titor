"use strict";

var createResource = require("../../lib/create-resource");
var path = require("path");
var sh = require("shelljs");

var rscSrcPackageExportJs = path.join(
  __dirname,
  "../../resource/src/_package-export.js"
);
var rscTitorrcYml = path.join(__dirname, "../../resource/_.titorrc.yml");
var fxtTitorrcYml = path.join(fxt, ".titorrc.yml");
var fxtTest = path.join(fxt, "test");
var fxtTestFixtureSrcJs = path.join(fxt, "test/fixture/src.js");
var fxtSrcPackageExportJs = path.join(fxt, "src/testPackage.js");

describe("createResource", function () {
  describe("no file already exists at dstPath", function () {
    var result;

    before(function () {
      minStandup();

      result = createResource(".titorrc.yml");
    });

    it("create file at dstPath", function () {
      expect(sh.test("-e", fxtTitorrcYml)).to.be.true;
    });

    it("return true", function () {
      expect(result).to.be.true;
    });

    after(teardown);
  });

  describe("a file already exists at dstPath", function () {
    var result;

    before(function () {
      minStandup();

      sh.ShellString("testing").to(fxtTitorrcYml);

      result = createResource(".titorrc.yml");
    });

    it("don't replace existing file at dstPath", function () {
      expect(sh.cat(fxtTitorrcYml).stdout).to.equal("testing");
    });

    it("return false", function () {
      expect(result).to.be.false;
    });

    after(teardown);
  });

  describe("pkgExport is undefined", function () {
    before(function () {
      minStandup();

      createResource(".titorrc.yml");
    });

    it("don't replace PACKAGE_EXPORT with pkgExport in dst file", function () {
      expect(sh.grep("export", fxtTitorrcYml).stdout.trim())
        .to.equal("export: PACKAGE_EXPORT");
    });

    after(teardown);
  });

  describe("pkgExport is defined", function () {
    before(function () {
      minStandup();

      sh.mkdir(fxtTest);

      createResource("test/fixture/src.js", "testPkg");
    });

    it("replace PACKAGE_EXPORT with pkgExport in dst file", function () {
      expect(sh.grep("testPkg", fxtTestFixtureSrcJs).stdout.trim())
        .to.equal("global.testPkg = require(\"../../src/test-pkg\");");
    });

    it("replace PACKAGE_FILE with decamelized pkgExport in dst", function () {
      expect(sh.grep("test-pkg", fxtTestFixtureSrcJs).stdout.trim())
        .to.equal("global.testPkg = require(\"../../src/test-pkg\");");
    });

    after(teardown);
  });

  describe("srcPath is undefined", function () {
    before(function () {
      minStandup();

      createResource(".titorrc.yml");
    });

    it("copy src file from default path to dstPath", function () {
      expect(sh.cat(fxtTitorrcYml).stdout)
        .to.equal(sh.cat(rscTitorrcYml).stdout);
    });

    after(teardown);
  });

  describe("srcPath is defined", function () {
    before(function () {
      minStandup();

      createResource("src/testPackage.js", undefined, rscSrcPackageExportJs);
    });

    it("copy src file from srcPath to dstPath", function () {
      expect(sh.cat(fxtSrcPackageExportJs).stdout)
        .to.equal(sh.cat(rscSrcPackageExportJs).stdout);
    });

    after(teardown);
  });
});
