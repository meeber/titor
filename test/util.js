"use strict";

var chai = require("chai");
var path = require("path");
var sh = require("shelljs");

var createBabelrc = require("../util/create-babelrc");
var createSrcIndex = require("../util/create-src-index");
var createTitorrc = require("../util/create-titorrc");
var detectBuild = require("../util/detect-build");
var loadConfig = require("../util/load-config");

var expect = chai.expect;

var resource = path.join(__dirname, "resource");
var tmpRoot = path.join(sh.tempdir(), "titor-test-root");

describe("util", function () {
  var tmpPackageJson = path.join(tmpRoot, "package.json");
  var goodPackageJson = path.join(resource, "good.package.json");
  var badFormatPackageJson = path.join(resource, "bad-format.package.json");
  var badNamePackageJson = path.join(resource, "bad-name.package.json");

  beforeEach(function () {
    if (sh.test("-e", tmpRoot)) sh.rm("-rf", tmpRoot);

    sh.mkdir(tmpRoot);
    sh.cd(tmpRoot);
    sh.cp(goodPackageJson, tmpPackageJson);
  });

  afterEach(function () {
    sh.cd(__dirname);
    sh.rm("-rf", tmpRoot);
  });

  describe("createBabelrc", function () {
    var tmpBabelrc = path.join(tmpRoot, ".babelrc");

    it("should create .babelrc and return true", function () {
      expect(createBabelrc()).to.be.true;
      expect(sh.test("-e", tmpBabelrc)).to.be.true;
    });

    it("should, if .babelrc already exists, return false", function () {
      createBabelrc();

      expect(createBabelrc()).to.be.false;
    });
  });

  describe("createSrcIndex", function () {
    var tmpSrcIndex = path.join(tmpRoot, "src/index.js");

    it("should create src/index.js, set default export to a function named"
     + " after project converted to CamelCase, and return true", function () {
      expect(createSrcIndex()).to.be.true;
      expect(sh.test("-e", tmpSrcIndex)).to.be.true;
      expect(sh.grep("testProject", tmpSrcIndex).stdout)
        .to.match(/testProject/);
    });

    it("should, if src/index.js already exists, return false", function () {
      createSrcIndex();

      expect(createSrcIndex()).to.be.false;
    });

    it("should, if no package.json, throw", function () {
      sh.rm(tmpPackageJson);

      expect(createSrcIndex).to.throw(/no such file/);
    });

    it("should, if invalid package.json, throw", function () {
      sh.cp(badFormatPackageJson, tmpPackageJson);

      expect(createSrcIndex).to.throw(/Unexpected token/);
    });

    it("should, if missing name in package.json, throw", function () {
      sh.cp(badNamePackageJson, tmpPackageJson);

      expect(createSrcIndex).to.throw("Missing name in package.json");
    });
  });

  describe("createTitorrc", function () {
    var tmpTitorrc = path.join(tmpRoot, ".titorrc");

    it("should create .titorrc, set export to project name converted to"
     + " CamelCase, and return true", function () {
      expect(createTitorrc()).to.be.true;
      expect(sh.test("-e", tmpTitorrc)).to.be.true;
      expect(sh.grep("testProject", tmpTitorrc).stdout).to.match(/testProject/);
    });

    it("should, if .titorrc already exists, return false", function () {
      createTitorrc();

      expect(createTitorrc()).to.be.false;
    });

    it("should, if no package.json, throw", function () {
      sh.rm(tmpPackageJson);

      expect(createTitorrc).to.throw(/no such file/);
    });

    it("should, if invalid package.json, throw", function () {
      sh.cp(badFormatPackageJson, tmpPackageJson);

      expect(createTitorrc).to.throw(/Unexpected token/);
    });

    it("should, if missing name in package.json, throw", function () {
      sh.cp(badNamePackageJson, tmpPackageJson);

      expect(createTitorrc).to.throw("Missing name in package.json");
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
