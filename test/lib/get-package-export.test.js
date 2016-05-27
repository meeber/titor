"use strict";

var getPackageExport = require("../../lib/get-package-export");

describe("getPackageExport", function () {
  describe("packageJson.name is a string", function () {
    var pkgExport;

    before(function () {
      pkgExport = getPackageExport({name: "test-package"});
    });

    it("return camelcased project name", function () {
      expect(pkgExport).to.equal("testPackage");
    });
  });

  describe("packageJson.name is undefined", function () {
    it("throw TypeError with descriptive message", function () {
      expect(function () { getPackageExport({}) })
        .to.throw(TypeError, "Missing or invalid name");
    });
  });

  describe("packageJson is undefined", function () {
    it("throw TypeError with descriptive message", function () {
      expect(getPackageExport)
        .to.throw(TypeError, "Missing or invalid packageJson");
    });
  });
});
