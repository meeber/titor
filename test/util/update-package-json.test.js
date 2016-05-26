"use strict";

var getMinPkgJsonObj = require("../fixture/helper/get-min-pkg-json-obj");
var getSetupPkgJsonObj = require("../fixture/helper/get-setup-pkg-json-obj");
var path = require("path");
var sh = require("shelljs");
var updatePackageJson = require("../../util/update-package-json");

var fxtPackageJson = path.join(fxt, "package.json");
var fxtPackageJsonSave = fxtPackageJson + ".save";

describe("updatePackageJson", function () {
  describe("package.json.save doesn't already exist", function () {
    var packageJson;

    before(function () {
      minStandup();

      packageJson = getMinPkgJsonObj();

      updatePackageJson(packageJson);
    });

    it("move package.json to package.json.save", function () {
      expect(JSON.parse(sh.cat(fxtPackageJsonSave)))
        .to.deep.equal(getMinPkgJsonObj());
    });

    it("create package.json with setup object", function () {
      expect(JSON.parse(sh.cat(fxtPackageJson)))
        .to.deep.equal(getSetupPkgJsonObj());
    });

    it("don't modify original object", function () {
      expect(packageJson).to.deep.equal(getMinPkgJsonObj());
    });

    after(teardown);
  });

  describe("package.json.save already exists", function () {
    before(function () {
      minStandup();

      sh.ShellString("pizza").to(fxtPackageJsonSave);
    });

    it("throw Error with descriptive message", function () {
      expect(function () { updatePackageJson(getMinPkgJsonObj()) })
        .to.throw("mv: dest file already exists: package.json.save");
    });

    it("don't modify existing package.json", function () {
      expect(JSON.parse(sh.cat(fxtPackageJson)))
        .to.deep.equal(getMinPkgJsonObj());
    });

    it("don't modify existing package.json.save", function () {
      expect(sh.cat(fxtPackageJsonSave).stdout).to.equal("pizza");
    });

    after(teardown);
  });
});
