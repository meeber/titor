"use strict";

var path = require("path");
var sh = require("shelljs");

var fxtBuild = path.join(fxt, "build");
var fxtBundle = path.join(fxt, "bundle");
var fxtCoverage = path.join(fxt, "coverage");

module.exports = function expectCleaned (dirs) {
  it("remove build directory", function () {
    expect(sh.test("-e", fxtBuild)).to.equal(dirs.indexOf("build") === -1);
  });

  it("don't remove bundle directory", function () {
    expect(sh.test("-e", fxtBundle)).to.equal(dirs.indexOf("bundle") === -1);
  });

  it("don't remove coverage directory", function () {
    expect(sh.test("-e", fxtCoverage))
      .to.equal(dirs.indexOf("coverage") === -1);
  });
};
