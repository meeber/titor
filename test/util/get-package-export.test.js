"use strict";

var getPackageExport = require("../../util/get-package-export");

describe("getPackageExport", function () {
  describe("packageJson.name is a string", function () {
    it("return camelcased project name", function () {
      expect(getPackageExport({name: "test-package"})).to.equal("testPackage");
    });
  });

  describe("packageJson.name is undefined", function () {
    it("throw TypeError", function () {
      expect(function () { getPackageExport({}) })
        .to.throw(TypeError, "Missing or invalid name");
    });
  });

  describe("packageJson is undefined", function () {
    it("throw TypeError", function () {
      expect(getPackageExport)
        .to.throw(TypeError, "Missing or invalid packageJson");
    });
  });
});
