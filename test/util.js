"use strict";

var chai = require("chai");
var path = require("path");
var sh = require("shelljs");

var copyBabelrc = require("../util/copy-babelrc");
var copyTitorrc = require("../util/copy-titorrc");
var detectBuild = require("../util/detect-build");
var loadConfig = require("../util/load-config");

var expect = chai.expect;

var resource = path.join(__dirname, "resource");
var tmpRoot = path.join(sh.tempdir(), "titor-test-root");

describe("util", function () {
  beforeEach(function () {
    if (sh.test("-e", tmpRoot)) sh.rm("-rf", tmpRoot);
    sh.mkdir(tmpRoot);
    sh.cd(tmpRoot);
  });

  afterEach(function () {
    sh.cd(__dirname);
    sh.rm("-rf", tmpRoot);
  });

  describe("copyBabelrc", function () {
    var tmpBabelrc = path.join(tmpRoot, ".babelrc");

    it("should copy .babelrc to project root and return true", function () {
      expect(copyBabelrc()).to.be.true;
      expect(sh.test("-e", tmpBabelrc)).to.be.true;
    });

    it("should, if .babelrc already exists, return false", function () {
      copyBabelrc();

      expect(copyBabelrc()).to.be.false;
    });
  });

  describe("copyTitorrc", function () {
    var tmpTitorrc = path.join(tmpRoot, ".titorrc");
    var tmpPackageJson = path.join(tmpRoot, "package.json");
    var goodPackageJson = path.join(resource, "good.package.json");
    var badFormatPackageJson = path.join(resource, "bad-format.package.json");
    var badNamePackageJson = path.join(resource, "bad-name.package.json");

    beforeEach(function () {
      sh.cp(goodPackageJson, tmpPackageJson);
    });

    it("should copy .titorrc to project root, replace PLACEHOLDER with project"
     + " name converted to CamelCase, and return true", function () {
      expect(copyTitorrc()).to.be.true;
      expect(sh.test("-e", tmpTitorrc)).to.be.true;
      expect(sh.grep("testProject", tmpTitorrc).stdout).to.match(/testProject/);
    });

    it("should, if .titorrc already exists, return false", function () {
      copyTitorrc();

      expect(copyTitorrc()).to.be.false;
    });

    it("should, if no package.json, throw", function () {
      sh.rm(tmpPackageJson);

      expect(copyTitorrc).to.throw(/no such file/);
    });

    it("should, if invalid package.json, throw", function () {
      sh.cp(badFormatPackageJson, tmpPackageJson);

      expect(copyTitorrc).to.throw(/Unexpected token/);
    });

    it("should, if missing name in package.json, throw", function () {
      sh.cp(badNamePackageJson, tmpPackageJson);

      expect(copyTitorrc).to.throw("Missing name in package.json");
    });
  });

  describe("detectBuild", function () {
    it("should, if node version is equal to minNodeVer, return 'current'",
    function () {
      expect(detectBuild(process.version)).to.equal("current");
    });

    it("should, if node version is greater than minNodeVer, return 'current'",
    function () {
      expect(detectBuild("v0.0.1")).to.equal("current");
    });

    it("should, if node version is less than minNodeVer, return 'legacy'",
    function () {
      expect(detectBuild("v999.99.99")).to.equal("legacy");
    });

    it("should, if minNodeVer is invalid, throw", function () {
      expect(function () { detectBuild("nacho cheese") })
        .to.throw("Invalid Version: nacho cheese");
    });
  });

  describe("loadConfig", function () {
    var tmpTitorrc = path.join(tmpRoot, ".titorrc");
    var goodTitorrc = path.join(resource, "good.titorrc");
    var badFormatTitorrc = path.join(resource, "bad-format.titorrc");
    var badExportTitorrc = path.join(resource, "bad-export.titorrc");

    beforeEach(function () {
      sh.cp(goodTitorrc, tmpTitorrc);
    });

    it("should return a config object", function () {
      expect(loadConfig()).to.be.an("object").with.property("export");
    });

    it("should, if no .titorrc, throw", function () {
      sh.rm(tmpTitorrc);

      expect(loadConfig).to.throw(/no such file/);
    });

    it("should, if invalid .titorrc, throw", function () {
      sh.cp(badFormatTitorrc, tmpTitorrc);

      expect(loadConfig).to.throw("Invalid .titorrc");
    });

    it("should, if invalid export, throw", function () {
      sh.cp(badExportTitorrc, tmpTitorrc);

      expect(loadConfig).to.throw(/Invalid or missing export/);
    });
  });
});
