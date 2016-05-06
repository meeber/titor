"use strict";

var chai = require("chai");
var os = require("os");
var path = require("path");
var sh = require("shelljs");

var copyBabelrc = require("../util/copy-babelrc");
var detectBuild = require("../util/detect-build");
var loadConfig = require("../util/load-config");

var expect = chai.expect;

var resource = path.join(__dirname, "resource");
var tmpRoot = path.join(os.tmpdir(), "titor-test-root");

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

    it("should copy a .babelrc file to project root and return true",
    function () {
      expect(copyBabelrc()).to.be.true;
      expect(sh.test("-e", tmpBabelrc)).to.be.true;
    });

    it("should, if .babelrc already exists, return false", function () {
      copyBabelrc();

      expect(copyBabelrc()).to.be.false;
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
