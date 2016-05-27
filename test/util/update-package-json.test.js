"use strict";

var expectPkgJsonUpdated = require("../fixture/expect/expect-pkg-json-updated");
var expectPkgJsonNotUpdated =
  require("../fixture/expect/expect-pkg-json-not-updated");
var getMinPkgJsonObj = require("../fixture/helper/get-min-pkg-json-obj");
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

    expectPkgJsonUpdated();

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

    expectPkgJsonNotUpdated();

    after(teardown);
  });
});
