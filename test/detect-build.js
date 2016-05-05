"use strict";

var chai = require("chai");
var detectBuild = require("../util/detect-build");

var expect = chai.expect;

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
