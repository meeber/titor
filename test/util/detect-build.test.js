"use strict";

var detectBuild = require("../../util/detect-build");

describe("detectBuild", function () {
  describe("node version is equal to minNodeVer", function () {
    var build;

    before(function () {
      build = detectBuild(process.version);
    });

    it("return 'current'", function () {
      expect(build).to.equal("current");
    });
  });

  describe("node version is greater than minNodeVer", function () {
    var build;

    before(function () {
      build = detectBuild("v0.0.1");
    });

    it("return 'current'", function () {
      expect(build).to.equal("current");
    });
  });

  describe("node version is less than minNodeVer", function () {
    var build;

    before(function () {
      build = detectBuild("v999.99.99");
    });

    it("return 'legacy'", function () {
      expect(build).to.equal("legacy");
    });
  });

  describe("minNodeVer is invalid", function () {
    it("throw TypeError with descriptive message", function () {
      expect(function () { detectBuild("nacho cheese") })
        .to.throw(TypeError, "Invalid Version: nacho cheese");
    });
  });
});
