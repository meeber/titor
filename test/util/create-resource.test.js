"use strict";

var createResource = require("../../util/create-resource");
var path = require("path");
var sh = require("shelljs");

describe("createResource", function () {
  var rootTitorrcYml = path.join(tmpRoot, ".titorrc.yml");

  afterEach(teardown);
  beforeEach(minStandup);

  describe("no file already exists at dstPath", function () {
    it("create file at dstPath", function () {
      createResource(".titorrc.yml");

      expect(sh.test("-e", rootTitorrcYml)).to.be.true;
    });

    it("return true", function () {
      expect(createResource(".titorrc.yml")).to.be.true;
    });
  });

  describe("a file already exists at dstPath", function () {
    beforeEach(function () { sh.ShellString("testing").to(rootTitorrcYml) });

    it("don't replace existing file at dstPath", function () {
      createResource(".titorrc.yml");

      expect(sh.cat(rootTitorrcYml).stdout).to.equal("testing");
    });

    it("return false", function () {
      expect(createResource(".titorrc.yml")).to.be.false;
    });
  });

  describe("pkgExport is undefined", function () {
    it("don't replace PACKAGE_EXPORT with pkgExport in dst file", function () {
      createResource(".titorrc.yml");

      expect(sh.grep("export", rootTitorrcYml).stdout.trim())
        .to.equal("export: PACKAGE_EXPORT");
    });
  });

  describe("pkgExport is defined", function () {
    it("replace PACKAGE_EXPORT with pkgExport in dst file", function () {
      createResource(".titorrc.yml", "testPackage");

      expect(sh.grep("export", rootTitorrcYml).stdout.trim())
        .to.equal("export: testPackage");
    });

    it("replace PACKAGE_FILE with decamelized pkgExport in dst", function () {
      var dstPath = path.join(tmpRoot, "test/fixture/src.js");

      sh.mkdir(path.join(tmpRoot, "test"));
      createResource("test/fixture/src.js", "testPkg");

      expect(sh.grep("test-pkg", dstPath).stdout.trim())
        .to.equal("global[\"testPkg\"] = require(\"../../src/test-pkg\");");
    });
  });

  describe("srcPath is undefined", function () {
    it("copy src file from default path to dstPath", function () {
      var srcPath = path.join(__dirname, "../../resource/_.titorrc.yml");

      createResource(".titorrc.yml");

      expect(sh.cat(rootTitorrcYml).stdout).to.equal(sh.cat(srcPath).stdout);
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
