"use strict";

var loadPackageJson = require("../../util/load-package-json");
var path = require("path");
var sh = require("shelljs");

describe("loadPackageJson", function () {
  var badFormatPackageJson = path.join(
    __dirname,
    "../fixture/resource/bad-format_package.json"
  );
  var rootPackageJson = path.join(tmpRoot, "package.json");

  afterEach(teardown);
  beforeEach(minStandup);

  describe("dir is undefined", function () {
    it("return a packageJson object from current directory", function () {
      expect(loadPackageJson()).to.deep.equal({
        name: "test-package",
        version: "0.0.0",
        description: "a test package",
      });
    });
  });

  describe("dir is defined", function () {
    it("return a packageJson object from dir", function () {
      var subDir = path.join(tmpRoot, "sub-dir");

      sh.mkdir(subDir);
      sh.mv(rootPackageJson, path.join(subDir, "package.json"));

      expect(loadPackageJson(subDir)).to.deep.equal({
        name: "test-package",
        version: "0.0.0",
        description: "a test package",
      });
    });
  });

  describe("package.json doesn't exist", function () {
    it("throw", function () {
      sh.rm(rootPackageJson);

      expect(loadPackageJson).to.throw(/no such file/);
    });
  });

  describe("package.json isn't valid JSON", function () {
    it("throw", function () {
      sh.cp(badFormatPackageJson, rootPackageJson);

      expect(loadPackageJson).to.throw(/Unexpected token/);
    });
  });
});
