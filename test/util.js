"use strict";

var chai = require("chai");
var path = require("path");
var sh = require("shelljs");

var createBabelrc = require("../util/create-babelrc");
var createSrcIndex = require("../util/create-src-index");
var createTestIndex = require("../util/create-test-index");
var createTitorrc = require("../util/create-titorrc");
var detectBuild = require("../util/detect-build");
var getPackageExport = require("../util/get-package-export");
var loadConfig = require("../util/load-config");
var loadPackageJson = require("../util/load-package-json");

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
     + " after packageExport, and return true", function () {
      expect(createSrcIndex("testPackage")).to.be.true;
      expect(sh.test("-e", tmpSrcIndex)).to.be.true;
      expect(sh.grep("testPackage", tmpSrcIndex).stdout)
        .to.match(/testPackage/);
    });

    it("should, if src/index.js already exists, return false", function () {
      createSrcIndex("testPackage");

      expect(createSrcIndex("testPackage")).to.be.false;
    });

    it("should, if missing packageExport, throw", function () {
      expect(function () { createSrcIndex() })
        .to.throw("Missing or invalid packageExport");
    });
  });

  describe("createTestIndex", function () {
    var tmpTestIndex = path.join(tmpRoot, "test/index.js");

    it("should create test/index.js, create a mocha describe function for"
     + " packageExport, and return true", function () {
      expect(createTestIndex("testPackage")).to.be.true;
      expect(sh.test("-e", tmpTestIndex)).to.be.true;
      expect(sh.grep("testPackage", tmpTestIndex).stdout)
        .to.match(/testPackage/);
    });

    it("should, if test/index.js already exists, return false", function () {
      createTestIndex("testPackage");

      expect(createTestIndex("testPackage")).to.be.false;
    });

    it("should, if missing packageExport, throw", function () {
      expect(function () { createTestIndex() })
        .to.throw("Missing or invalid packageExport");
    });
  });

  describe("createTitorrc", function () {
    var tmpTitorrc = path.join(tmpRoot, ".titorrc");

    it("should create .titorrc, set export to packageExport, and return true",
    function () {
      expect(createTitorrc("testPackage")).to.be.true;
      expect(sh.test("-e", tmpTitorrc)).to.be.true;
      expect(sh.grep("testPackage", tmpTitorrc).stdout).to.match(/testPackage/);
    });

    it("should, if .titorrc already exists, return false", function () {
      createTitorrc("testPackage");

      expect(createTitorrc("testPackage")).to.be.false;
    });

    it("should, if missing packageExport, throw", function () {
      expect(function () { createTitorrc() })
        .to.throw("Missing or invalid packageExport");
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

  describe("getPackageExport", function () {
    it("should return camelcased project name", function () {
      expect(getPackageExport({name: "test-package"})).to.equal("testPackage");
    });

    it("should, if missing packageJson, throw", function () {
      expect(getPackageExport).to.throw("Missing or invalid packageJson");
    });

    it("should, if missing name in packageJson, throw", function () {
      expect(function () { getPackageExport({}) })
        .to.throw("Missing or invalid name");
    });
  });

  describe("loadConfig", function () {
    var tmpTitorrc = path.join(tmpRoot, ".titorrc");
    var goodTitorrc = path.join(resource, "good.titorrc");
    var badFormatTitorrc = path.join(resource, "bad-format.titorrc");
    var badExportTitorrc = path.join(resource, "bad-export.titorrc");

    beforeEach(function () { sh.cp(goodTitorrc, tmpTitorrc) });

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

  describe("loadPackageJson", function () {
    var tmpPackageJson = path.join(tmpRoot, "package.json");
    var goodPackageJson = path.join(resource, "good.package.json");
    var badFormatPackageJson = path.join(resource, "bad-format.package.json");

    beforeEach(function () { sh.cp(goodPackageJson, tmpPackageJson) });

    it("should return package object", function () {
      expect(loadPackageJson()).to.deep.equal({
        name: "test-package",
        version: "0.0.0",
        description: "a test package",
      });
    });

    it("should, if no package.json, throw", function () {
      sh.rm(tmpPackageJson);

      expect(loadPackageJson).to.throw(/no such file/);
    });

    it("should, if invalid package.json, throw", function () {
      sh.cp(badFormatPackageJson, tmpPackageJson);

      expect(loadPackageJson).to.throw(/Unexpected token/);
    });
  });
});
