"use strict";

var chai = require("chai");
var path = require("path");
var sh = require("shelljs");
var sinon = require("sinon");
var sinonChai = require("sinon-chai");

chai.use(sinonChai);

var configurePath = require("../lib/configure-path");
var createResource = require("../lib/create-resource");
var detectBuild = require("../lib/detect-build");
var getPackageExport = require("../lib/get-package-export");
var loadConfig = require("../lib/load-config");
var loadPackageJson = require("../lib/load-package-json");
var release = require("../lib/release");

var expect = chai.expect;
var resource = path.join(__dirname, "resource");
var tmpRoot = path.join(sh.tempdir(), "titor-test-root");

describe("lib", function () {
  beforeEach(function () {
    if (sh.test("-e", tmpRoot)) sh.rm("-rf", tmpRoot);

    sh.mkdir(tmpRoot);
    sh.cd(tmpRoot);
  });

  afterEach(function () {
    sh.cd(__dirname);
    sh.rm("-rf", tmpRoot);
  });

  describe("configurePath", function () {
    var fakePath = "/a/b/c:/x/y/z";
    var origPath = process.env.PATH;
    var rootNodeModules = path.resolve(tmpRoot, "node_modules/.bin");
    var expected = rootNodeModules + ":" + fakePath;

    afterEach(function () { process.env.PATH = origPath });

    beforeEach(function () { process.env.PATH = fakePath });

    it("should add root's node_modules to path", function () {
      configurePath();

      expect(process.env.PATH).to.equal(expected);
    });

    it("shouldn't modify path if already configured", function () {
      configurePath();
      configurePath();

      expect(process.env.PATH).to.equal(expected);
    });
  });

  describe("createResource", function () {
    it("should create .babelrc and return true", function () {
      var tmpBabelrc = path.join(tmpRoot, ".babelrc");

      expect(createResource(".babelrc")).to.be.true;
      expect(sh.test("-e", tmpBabelrc)).to.be.true;
      expect(sh.grep("plugins", tmpBabelrc).stdout).to.match(/plugins/);
    });

    it("should create .eslintignore and return true", function () {
      var tmpEslintignore = path.join(tmpRoot, ".eslintignore");

      expect(createResource(".eslintignore")).to.be.true;
      expect(sh.test("-e", tmpEslintignore)).to.be.true;
      expect(sh.grep("build", tmpEslintignore).stdout).to.match(/build/);
    });

    it("should create .eslintrc.yml and return true", function () {
      var tmpEslintrcYml = path.join(tmpRoot, ".eslintrc.yml");

      expect(createResource(".eslintrc.yml")).to.be.true;
      expect(sh.test("-e", tmpEslintrcYml)).to.be.true;
      expect(sh.grep("parser", tmpEslintrcYml).stdout).to.match(/parser/);
    });

    it("should create .gitignore and return true", function () {
      var tmpGitignore = path.join(tmpRoot, ".gitignore");

      expect(createResource(".gitignore")).to.be.true;
      expect(sh.test("-e", tmpGitignore)).to.be.true;
      expect(sh.grep("npm-debug", tmpGitignore).stdout).to.match(/npm-debug/);
    });

    it("should create .titorrc.yml, replace PACKAGE_EXPORT, and return true",
    function () {
      var tmpTitorrcYml = path.join(tmpRoot, ".titorrc.yml");

      expect(createResource(".titorrc.yml", "testPackage")).to.be.true;
      expect(sh.test("-e", tmpTitorrcYml)).to.be.true;
      expect(sh.grep("testPackage", tmpTitorrcYml).stdout)
        .to.match(/testPackage/);
    });

    it("should create .travis.yml and return true", function () {
      var tmpTravisYml = path.join(tmpRoot, ".travis.yml");

      expect(createResource(".travis.yml")).to.be.true;
      expect(sh.test("-e", tmpTravisYml)).to.be.true;
      expect(sh.grep("sudo", tmpTravisYml).stdout).to.match(/sudo/);
    });

    it("should create src/index.js, replace PACKAGE_EXPORT, and return true",
    function () {
      var tmpSrcIndexJs = path.join(tmpRoot, "src/index.js");

      expect(createResource("src/index.js", "testPackage")).to.be.true;
      expect(sh.test("-e", tmpSrcIndexJs)).to.be.true;
      expect(sh.grep("testPackage", tmpSrcIndexJs).stdout)
        .to.match(/testPackage/);
    });

    it("should create test/.eslintrc and return true", function () {
      var tmpTestEslintrcYml = path.join(tmpRoot, "test/.eslintrc.yml");

      expect(createResource("test/.eslintrc.yml")).to.be.true;
      expect(sh.test("-e", tmpTestEslintrcYml)).to.be.true;
      expect(sh.grep("mocha", tmpTestEslintrcYml).stdout).to.match(/mocha/);
    });

    it("should create test/index.js, replace PACKAGE_EXPORT, and return true",
    function () {
      var tmpTestIndexJs = path.join(tmpRoot, "test/index.js");

      expect(createResource("test/index.js", "testPackage")).to.be.true;
      expect(sh.test("-e", tmpTestIndexJs)).to.be.true;
      expect(sh.grep("testPackage", tmpTestIndexJs).stdout)
        .to.match(/testPackage/);
    });

    it("should, if resource already exists, return false", function () {
      createResource(".babelrc");

      expect(createResource(".babelrc")).to.be.false;
    });

    it("should, if subdirectory already exists, still create resource",
    function () {
      var tmpSrcIndexJs = path.join(tmpRoot, "src/index.js");

      sh.mkdir(path.dirname(tmpSrcIndexJs));
      createResource("src/index.js");

      expect(sh.test("-e", tmpSrcIndexJs)).to.be.true;
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
    var tmpTitorrcYml = path.join(tmpRoot, ".titorrc.yml");
    var goodTitorrcYml = path.join(resource, "good.titorrc.yml");
    var badFormatTitorrcYml = path.join(resource, "bad-format.titorrc.yml");
    var badExportTitorrcYml = path.join(resource, "bad-export.titorrc.yml");

    beforeEach(function () { sh.cp(goodTitorrcYml, tmpTitorrcYml) });

    it("should return a config object", function () {
      expect(loadConfig()).to.be.an("object").with.property("export");
    });

    it("should, if no .titorrc.yml, throw", function () {
      sh.rm(tmpTitorrcYml);

      expect(loadConfig).to.throw(/no such file/);
    });

    it("should, if invalid .titorrc.yml, throw", function () {
      sh.cp(badFormatTitorrcYml, tmpTitorrcYml);

      expect(loadConfig).to.throw("Invalid .titorrc.yml");
    });

    it("should, if invalid export, throw", function () {
      sh.cp(badExportTitorrcYml, tmpTitorrcYml);

      expect(loadConfig).to.throw(/Invalid or missing export/);
    });
  });

  describe("loadPackageJson", function () {
    var tmpPackageJson = path.join(tmpRoot, "package.json");
    var goodPackageJson = path.join(resource, "good.package.json");
    var badFormatPackageJson = path.join(resource, "bad-format.package.json");

    beforeEach(function () { sh.cp(goodPackageJson, tmpPackageJson) });

    it("should return packageJson object from current directory", function () {
      expect(loadPackageJson()).to.deep.equal({
        name: "test-package",
        version: "0.0.0",
        description: "a test package",
      });
    });

    it("should, if dir given, return packageJson object from that directory",
    function () {
      var tmpSubDir = path.join(tmpRoot, "sub-dir");
      var tmpSubDirPackageJson = path.join(tmpSubDir, "package.json");

      sh.mkdir(tmpSubDir);
      sh.mv(tmpPackageJson, tmpSubDirPackageJson);

      expect(loadPackageJson(tmpSubDir)).to.deep.equal({
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

  describe("release", function () {
    var stubs = ["echo", "exec"];
    var stubSh;

    afterEach(function () {
      stubs.forEach(function (stub) { stubSh[stub].restore() });
    });

    beforeEach(function () {
      stubSh = {};
      stubs.forEach(function (stub) { stubSh[stub] = sinon.stub(sh, stub) });
    });

    it("should call 'npm version' with given version", function () {
      var exp = "npm version patch -m 'Finalize v%s'";

      release("patch", sh);

      expect(stubSh.exec).to.have.been.calledWith(exp);
    });
  });
});
