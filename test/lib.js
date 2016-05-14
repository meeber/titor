"use strict";

var chai = require("chai");
var path = require("path");
var sh = require("shelljs");
var sinon = require("sinon");
var sinonChai = require("sinon-chai");

chai.use(sinonChai);
sh.set("-e");

var bundle = require("../lib/bundle");
var clean = require("../lib/clean");
var clone = require("../lib/clone");
var configurePath = require("../lib/configure-path");
var createResource = require("../lib/create-resource");
var detectBuild = require("../lib/detect-build");
var getPackageExport = require("../lib/get-package-export");
var lint = require("../lib/lint");
var loadConfig = require("../lib/load-config");
var loadPackageJson = require("../lib/load-package-json");
var postversion = require("../lib/postversion");
var preversion = require("../lib/preversion");
var release = require("../lib/release");
var setup = require("../lib/setup");
var setupPackageJson = require("../lib/setup-package-json");
var test = require("../lib/test");
var travis = require("../lib/travis");

var detectedBuild = detectBuild();
var expect = chai.expect;
var resource = path.join(__dirname, "resource");
var tmpRoot = path.join(sh.tempdir(), "titor-test-root");

var updatedPackageJson = {
  name: "test-package",
  version: "0.0.0",
  description: "a test package",
  main: "build/",
  dependencies: {
    semver: "^5.1.0",
  },
  devDependencies: {
    "babel-cli": "^6.7.5",
    "babel-core": "^6.8.0",
    "babel-eslint": "^6.0.4",
    "babel-plugin-add-module-exports": "^0.2.1",
    "babel-plugin-transform-es2015-modules-commonjs": "^6.8.0",
    "babel-polyfill": "^6.7.4",
    "babel-preset-es2015": "^6.6.0",
    "babel-preset-stage-0": "^6.5.0",
    browserify: "^13.0.1",
    chai: "^3.5.0",
    coveralls: "^2.11.9",
    eslint: "^2.9.0",
    exorcist: "^0.4.0",
    istanbul: "^1.0.0-alpha.2",
    "js-yaml": "^3.6.1",
    mocha: "^2.4.5",
    "source-map-support": "^0.4.0",
  },
  scripts: {
    build: "titor-build",
    bundle: "titor-bundle",
    clean: "titor-clean",
    lint: "titor-lint",
    postversion: "titor-postversion",
    preversion: "titor-preversion",
    release: "titor-release",
    test: "titor-test",
    travis: "titor-travis",
  },
};

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

  describe("bundle", function () {
    var stubs = ["echo", "exec"];
    var stubSh;
    var tmpCurBuildBundleDir = path.join(tmpRoot, "bundle/current");
    var tmpCurBuildBundleMap = path.join(tmpCurBuildBundleDir, "bundle.js.map");
    var tmpCurTestBundleDir = path.join(tmpCurBuildBundleDir, "test");
    var tmpCurTestBundleMap = path.join(tmpCurTestBundleDir, "test.js.map");
    var tmpLegBuildBundleDir = path.join(tmpRoot, "bundle/legacy");
    var tmpLegBuildBundleMap = path.join(tmpLegBuildBundleDir, "bundle.js.map");
    var tmpLegTestBundleDir = path.join(tmpLegBuildBundleDir, "test");
    var tmpLegTestBundleMap = path.join(tmpLegTestBundleDir, "test.js.map");

    afterEach(function () {
      stubs.forEach(function (stub) { stubSh[stub].restore() });
    });

    beforeEach(function () {
      stubSh = {};
      stubs.forEach(function (stub) {
        // TODO: Remove this if exorcist updated to throw errors
        var fn = stub !== "exec" ? undefined : function () {
          if (!sh.test("-e", tmpCurBuildBundleMap)) {
            sh.mkdir("-p", tmpCurTestBundleDir, tmpLegTestBundleDir);
            sh.touch(
              tmpCurBuildBundleMap,
              tmpCurTestBundleMap,
              tmpLegBuildBundleMap,
              tmpLegTestBundleMap
            );
          }
        };

        stubSh[stub] = sinon.stub(sh, stub, fn);
      });
    });

    it("should create build bundle for given type", function () {
      var exp = "browserify"
              + " -d"
              + " -s testPackage"
              + " build/current"
              + " | exorcist bundle/current/bundle.js.map"
              + " > bundle/current/bundle.js";

      bundle(["current"], {export: "testPackage"});

      expect(stubSh.exec).to.have.been.calledWith(exp);
    });

    it("should create test bootstrap bundle for given type", function () {
      var exp = "browserify "
              + " -d "
              + path.join(__dirname, "../test-bootstrap/common.js")
              + " -o bundle/current/test/bootstrap.js";

      bundle(["current"], {export: "testPackage"});

      expect(stubSh.exec).to.have.been.calledWith(exp);
    });

    it("should, if legacy type, create test bootstrap bundle with shim",
    function () {
      var exp = "browserify "
              + "-r babel-polyfill"
              + " -d "
              + path.join(__dirname, "../test-bootstrap/common.js")
              + " -o bundle/legacy/test/bootstrap.js";

      bundle(["legacy"], {export: "testPackage"});

      expect(stubSh.exec).to.have.been.calledWith(exp);
    });

    it("should create test bundle for given type", function () {
      var exp = "browserify"
              + " -d "
              + "build/current/test/"
              + " | exorcist bundle/current/test/test.js.map"
              + " > bundle/current/test/test.js";

      bundle(["current"], {export: "testPackage"});

      expect(stubSh.exec).to.have.been.calledWith(exp);
    });

    it("should copy test bundle resources for given type", function () {
      var tmpIndexHtml = path.join(tmpRoot, "bundle/current/test/index.html");
      var tmpMochaCss = path.join(tmpRoot, "bundle/current/test/mocha.css");
      var tmpMochaJs = path.join(tmpRoot, "bundle/current/test/mocha.js");

      bundle(["current"], {export: "testPackage"});

      expect(sh.test("-e", tmpIndexHtml)).to.be.true;
      expect(sh.test("-e", tmpMochaCss)).to.be.true;
      expect(sh.test("-e", tmpMochaJs)).to.be.true;
    });

    it("should, if multiple types, create bundles for each one", function () {
      bundle(["current", "legacy"], {export: "testPackage"});

      expect(stubSh.exec).to.have.callCount(6);
    });

    it("should, if invalid type, throw", function () {
      expect(function () { bundle(["invalid_type"]) })
        .to.throw("Invalid bundle: invalid_type");
    });
  });

  describe("clean", function () {
    var stubs = ["echo"];
    var stubSh;

    afterEach(function () {
      stubs.forEach(function (stub) { stubSh[stub].restore() });
    });

    beforeEach(function () {
      stubSh = {};
      stubs.forEach(function (stub) { stubSh[stub] = sinon.stub(sh, stub) });
    });

    it("should delete target subdirectories", function () {
      var tmpBuild = path.join(tmpRoot, "build");
      var tmpBuildA = path.join(tmpBuild, "A");
      var tmpBundle = path.join(tmpRoot, "bundle");
      var tmpBundleB = path.join(tmpBundle, "B");
      var tmpCoverage = path.join(tmpRoot, "coverage");
      var tmpCoverageC = path.join(tmpCoverage, "C");

      sh.mkdir("-p", tmpBuildA, tmpBundleB, tmpCoverageC);

      clean(["build", "coverage"]);

      expect(sh.test("-e", tmpBuild)).to.be.false;
      expect(sh.test("-e", tmpBundle)).to.be.true;
      expect(sh.test("-e", tmpCoverage)).to.be.false;
    });

    it("should, if invalid target, throw", function () {
      expect(function () { clean(["invalid_target"]) })
        .to.throw("Invalid clean target: invalid_target");
    });
  });

  describe("clone", function () {
    it("should return a deep-copied clone of object", function () {
      var obj = {a: {b: 1, c: [2, {d: "blah"}]}, e: {f: [{g: [7]}]}};

      var clonedObj = clone(obj);

      expect(clonedObj).to.deep.equal(obj);
      expect(clonedObj).to.not.equal(obj);
    });
  });

  describe("configurePath", function () {
    var origPath = process.env.PATH;
    var rootNodeModules = path.resolve(tmpRoot, "node_modules/.bin");

    afterEach(function () { process.env.PATH = origPath });

    beforeEach(function () {
      var goodPackageJson = path.join(resource, "good.package.json");
      var tmpPackageJson = path.join(tmpRoot, "package.json");

      sh.cp(goodPackageJson, tmpPackageJson);
    });

    it("should add package's node_modules/.bin to path", function () {
      configurePath();

      expect(process.env.PATH).to.match(new RegExp(rootNodeModules));
    });

    it("should, if in subdirectory, correctly configure path", function () {
      var tmpSubdir = path.join(tmpRoot, "subdir");

      sh.mkdir(tmpSubdir);
      sh.cd(tmpSubdir);

      configurePath();

      expect(process.env.PATH).to.match(new RegExp(rootNodeModules));
    });

    it("shouldn't modify path if already configured", function () {
      configurePath();
      var configuredPath = process.env.PATH;
      configurePath();

      expect(process.env.PATH).to.equal(configuredPath);
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

  describe("lint", function () {
    var stubs = ["echo", "exec"];
    var stubSh;

    afterEach(function () {
      stubs.forEach(function (stub) { stubSh[stub].restore() });
    });

    beforeEach(function () {
      stubSh = {};
      stubs.forEach(function (stub) { stubSh[stub] = sinon.stub(sh, stub) });
    });

    it("should call 'eslint' on current directory", function () {
      var exp = "eslint --color --fix .";

      lint();

      expect(stubSh.exec).to.have.been.calledWith(exp);
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

      expect(function () { loadPackageJson() }).to.throw(/no such file/);
    });

    it("should, if invalid package.json, throw", function () {
      sh.cp(badFormatPackageJson, tmpPackageJson);

      expect(function () { loadPackageJson() }).to.throw(/Unexpected token/);
    });
  });

  describe("postversion", function () {
    var stubs = ["echo", "exec"];
    var stubSh;

    afterEach(function () {
      stubs.forEach(function (stub) { stubSh[stub].restore() });
    });

    beforeEach(function () {
      stubSh = {};
      stubs.forEach(function (stub) { stubSh[stub] = sinon.stub(sh, stub) });
    });

    it("should check out dev branch, merge master, push branch/tags, and"
     + " publish to npm", function () {
      postversion();

      expect(stubSh.exec.getCall(0))
        .to.have.been.calledWith("git checkout dev");
      expect(stubSh.exec.getCall(1))
        .to.have.been.calledWith("git merge master");
      expect(stubSh.exec.getCall(2)).to.have.been.calledWith("git push");
      expect(stubSh.exec.getCall(3)).to.have.been.calledWith("git push --tags");
      expect(stubSh.exec.getCall(4)).to.have.been.calledWith("npm publish");
    });
  });

  describe("preversion", function () {
    var stubs = ["echo", "exec"];
    var stubSh;

    afterEach(function () {
      stubs.forEach(function (stub) { stubSh[stub].restore() });
    });

    beforeEach(function () {
      stubSh = {};
      stubs.forEach(function (stub) { stubSh[stub] = sinon.stub(sh, stub) });
    });

    it("should check out master branch, merge dev, run build script, and stage"
     + " working files", function () {
      preversion();

      expect(stubSh.exec.getCall(0))
        .to.have.been.calledWith("git checkout master");
      expect(stubSh.exec.getCall(1)).to.have.been.calledWith("git merge dev");
      expect(stubSh.exec.getCall(2)).to.have.been.calledWith("npm run build");
      expect(stubSh.exec.getCall(3)).to.have.been.calledWith("git add -A");
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

      release("patch");

      expect(stubSh.exec).to.have.been.calledWith(exp);
    });
  });

  describe("setup", function () {
    var badFormatPackageJson = path.join(resource, "bad-format.package.json");
    var dummy = path.join(resource, "dummy");
    var goodPackageJson = path.join(resource, "good.package.json");
    var resources = [
      ".babelrc",
      ".eslintignore",
      ".eslintrc.yml",
      ".gitignore",
      ".titorrc.yml",
      ".travis.yml",
      "src/index.js",
      "test/.eslintrc.yml",
      "test/index.js",
    ];
    var stubs = ["echo"];
    var stubSh;
    var tmpPackageJson = path.join(tmpRoot, "package.json");

    afterEach(function () {
      stubs.forEach(function (stub) { stubSh[stub].restore() });
    });

    beforeEach(function () {
      stubSh = {};
      stubs.forEach(function (stub) { stubSh[stub] = sinon.stub(sh, stub) });
      sh.cp(goodPackageJson, tmpPackageJson);
    });

    it("should update package.json", function () {
      setup();

      expect(JSON.parse(sh.cat(tmpPackageJson)))
        .to.deep.equal(updatedPackageJson);
    });

    it("should make a backup of package.json", function () {
      setup();

      expect(sh.cat(path.join(tmpRoot, "package.json.save")).stdout)
        .to.equal(sh.cat(goodPackageJson).stdout);
    });

    it("should create resource files", function () {
      setup();

      resources.forEach(function (res) {
        expect(sh.test("-e", res)).to.be.true;
      });
    });

    it("shouldn't overwrite existing resource files", function () {
      sh.mkdir(path.join(tmpRoot, "src"), path.join(tmpRoot, "test"));
      resources.forEach(function (res) { sh.cp(dummy, res) });

      setup();

      resources.forEach(function (res) {
        expect(sh.cat(res).stdout).to.equal("nada\n");
      });
    });

    it("should, if no package.json, throw", function () {
      sh.rm(tmpPackageJson);

      expect(function () { setup() }).to.throw(/no such file/);
    });

    it("should, if invalid package.json, throw", function () {
      sh.cp(badFormatPackageJson, tmpPackageJson);

      expect(function () { setup() }).to.throw(/Unexpected token/);
    });
  });

  describe("setupPackageJson", function () {
    it("should return an updated object", function () {
      var packageJson = {
        name: "test-package",
        version: "0.0.0",
        description: "a test package",
        main: "index.js",
        devDependencies: {
          semver: "blah",
        },
      };

      expect(setupPackageJson(packageJson)).to.deep.equal(updatedPackageJson);
    });
  });

  describe("test", function () {
    var stubs = ["echo", "exec"];
    var stubSh;
    var tmpCoverage = path.join(tmpRoot, "coverage");

    afterEach(function () {
      stubs.forEach(function (stub) { stubSh[stub].restore() });
    });

    beforeEach(function () {
      stubSh = {};
      stubs.forEach(function (stub) { stubSh[stub] = sinon.stub(sh, stub) });
    });

    it("should, if current type, run mocha on current build", function () {
      var exp = "mocha -c"
              + " -r " + path.join(__dirname, "../test-bootstrap/current")
              + " build/current/test";

      test(["current"]);

      expect(stubSh.exec).to.have.been.calledWith(exp);
    });

    it("should, if legacy type, run mocha on legacy build", function () {
      var exp = "mocha -c"
              + " -r " + path.join(__dirname, "../test-bootstrap/legacy")
              + " build/legacy/test";

      test(["legacy"]);

      expect(stubSh.exec).to.have.been.calledWith(exp);
    });

    it("should, if src type with coverage and lint, delete coverage directory,"
     + " run istanbul and mocha with babel of detected build, and run lint",
    function () {
      var exp0 = "BABEL_ENV=" + detectedBuild
               + " istanbul cover"
               + " --report lcovonly"
               + " --root src/"
               + " _mocha -- -c "
               + " -r " + path.join(__dirname, "../test-bootstrap/src")
               + " test/";
      var exp1 = "eslint --color --fix .";

      sh.mkdir(tmpCoverage);

      test(["src"], {cover: true, lint: true});

      expect(sh.test("-e", tmpCoverage)).to.be.false;
      expect(stubSh.exec.getCall(0)).to.have.been.calledWith(exp0);
      expect(stubSh.exec.getCall(1)).to.have.been.calledWith(exp1);
    });

    it("should, if src type with coverage but no lint, delete coverage"
     + " directory, run istanbul and mocha with babel of detected build",
    function () {
      var exp = "BABEL_ENV=" + detectedBuild
              + " istanbul cover"
              + " --report lcovonly"
              + " --root src/"
              + " _mocha -- -c "
              + " -r " + path.join(__dirname, "../test-bootstrap/src")
              + " test/";

      sh.mkdir(tmpCoverage);

      test(["src"], {cover: true, lint: false});

      expect(sh.test("-e", tmpCoverage)).to.be.false;
      expect(stubSh.exec).to.have.been.calledOnce;
      expect(stubSh.exec).to.have.been.calledWith(exp);
    });

    it("should, if src type with lint but no coverage, run mocha with babel of"
     + " detected build, and run lint", function () {
      var exp0 = "BABEL_ENV=" + detectedBuild
               + " mocha -c "
               + " -r " + path.join(__dirname, "../test-bootstrap/src")
               + " test/";
      var exp1 = "eslint --color --fix .";

      sh.mkdir(tmpCoverage);

      test(["src"], {cover: false, lint: true});

      expect(sh.test("-e", tmpCoverage)).to.be.true;
      expect(stubSh.exec.getCall(0)).to.have.been.calledWith(exp0);
      expect(stubSh.exec.getCall(1)).to.have.been.calledWith(exp1);
    });

    it("should, if src type with no coverage and no lint, run mocha with babel"
     + " of detected build", function () {
      var exp = "BABEL_ENV=" + detectedBuild
              + " mocha -c "
              + " -r " + path.join(__dirname, "../test-bootstrap/src")
              + " test/";

      sh.mkdir(tmpCoverage);

      test(["src"], {cover: false, lint: false});

      expect(sh.test("-e", tmpCoverage)).to.be.true;
      expect(stubSh.exec).to.have.been.calledOnce;
      expect(stubSh.exec).to.have.been.calledWith(exp);
    });

    it("should, if multiple types, run each one", function () {
      test(["current", "legacy", "src"], {});

      expect(stubSh.exec).to.have.been.calledThrice;
    });

    it("should, if invalid type, throw", function () {
      expect(function () { test(["invalid_type"]) })
        .to.throw("Invalid test: invalid_type");
    });
  });

  describe("travis", function () {
    var stubs = ["cat", "echo", "exec"];
    var stubSh;

    afterEach(function () {
      stubs.forEach(function (stub) { stubSh[stub].restore() });
    });

    beforeEach(function () {
      stubSh = {};
      stubs.forEach(function (stub) {
        stubSh[stub] = sinon.stub(sh, stub, function () {
          return sh;
        });
      });
    });

    it("should, if config.coverReport is false, run build but not coveralls",
    function () {
      travis({coverReport: false});

      expect(stubSh.exec).to.have.been.calledOnce;
      expect(stubSh.exec).to.have.been.calledWith("npm run build");
      expect(stubSh.exec).to.have.not.been.calledWith("coveralls");
    });

    it("should, if config.coverReport is true, run build and coveralls",
    function () {
      travis({coverReport: true});

      expect(stubSh.exec).to.have.been.calledWith("npm run build");
      expect(stubSh.exec).to.have.been.calledWith("coveralls");
    });
  });
});
