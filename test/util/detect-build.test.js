"use strict";

var detectBuild = require("../../util/detect-build");

describe("detectBuild", function () {
  describe("node version is equal to minNodeVer", function () {
    it("return 'current'", function () {
      expect(detectBuild(process.version)).to.equal("current");
    });
  });

  describe("node version is greater than minNodeVer", function () {
    it("return 'current'", function () {
      expect(detectBuild("v0.0.1")).to.equal("current");
    });
  });

  describe("node version is less than minNodeVer", function () {
    it("return 'legacy'", function () {
      expect(detectBuild("v999.99.99")).to.equal("legacy");
    });
  });

  describe("minNodeVer is invalid", function () {
    it("throw", function () {
      expect(function () { detectBuild("nacho cheese") })
        .to.throw("Invalid Version: nacho cheese");
    });
  });
});
