"use strict";

var getMinPkgJsonObj = require("../fixture/helper/get-min-pkg-json-obj");
var loadPackageJson = require("../../lib/load-package-json");
var path = require("path");
var sh = require("shelljs");

var badFormatPackageJson = path.join(
  __dirname,
  "../fixture/resource/bad-format_package.json"
);
var fxtPackageJson = path.join(fxt, "package.json");
var fxtSubDir = path.join(fxt, "sub-dir");
var fxtSubDirPackageJson = path.join(fxtSubDir, "package.json");

describe("loadPackageJson", function () {
  describe("dir is undefined", function () {
    var pkgJson;

    before(function () {
      minStandup();

      pkgJson = loadPackageJson();
    });

    it("return a packageJson object from current directory", function () {
      expect(pkgJson).to.deep.equal(getMinPkgJsonObj());
    });

    after(teardown);
  });

  describe("dir is defined", function () {
    var pkgJson;

    before(function () {
      minStandup();

      sh.mkdir(fxtSubDir);
      sh.mv(fxtPackageJson, fxtSubDirPackageJson);

      pkgJson = loadPackageJson(fxtSubDir);
    });

    it("return a packageJson object from dir", function () {
      expect(pkgJson).to.deep.equal(getMinPkgJsonObj());
    });

    after(teardown);
  });

  describe("package.json doesn't exist", function () {
    before(function () {
      minStandup();

      sh.rm(fxtPackageJson);
    });

    it("throw Error with descriptive message", function () {
      expect(loadPackageJson).to.throw(Error, /no such file/);
    });

    after(teardown);
  });

  describe("package.json isn't valid JSON", function () {
    before(function () {
      minStandup();

      sh.cp(badFormatPackageJson, fxtPackageJson);
    });

    it("throw Error with descriptive message", function () {
      expect(loadPackageJson).to.throw(Error, /Unexpected token/);
    });

    after(teardown);
  });
});
