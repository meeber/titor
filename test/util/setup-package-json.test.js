"use strict";

var getMinPkgJsonObj = require("../fixture/helper/get-min-pkg-json-obj");
var getSetupPkgJsonObj = require("../fixture/helper/get-setup-pkg-json-obj");
var setupPackageJson = require("../../util/setup-package-json");

describe("setupPackageJson", function () {
  describe("curPj has a minimal configuration", function () {
    var curPj, newPj;

    before(function () {
      curPj = getMinPkgJsonObj();

      newPj = setupPackageJson(curPj);
    });

    it("return configured packageJson object", function () {
      expect(newPj).to.deep.equal(getSetupPkgJsonObj());
    });

    it("don't modify curPj", function () {
      expect(curPj).to.deep.equal(getMinPkgJsonObj());
    });
  });

  describe("curPj has semver in devDependencies", function () {
    var curPj, newPj;

    before(function () {
      curPj = getMinPkgJsonObj();
      curPj.devDependencies = {semver: "^5.1.0"};

      newPj = setupPackageJson(curPj);
    });

    it("remove semver from devDependencies in returned object", function () {
      expect(newPj).to.deep.equal(getSetupPkgJsonObj());
    });
  });
});
