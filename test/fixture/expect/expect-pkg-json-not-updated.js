"use strict";

var getMinPkgJsonObj = require("../helper/get-min-pkg-json-obj");
var path = require("path");
var sh = require("shelljs");

var fxtPackageJson = path.join(fxt, "package.json");
var fxtPackageJsonSave = fxtPackageJson + ".save";

module.exports = function expectPkgJsonNotUpdated () {
  it("don't modify existing package.json", function () {
    expect(JSON.parse(sh.cat(fxtPackageJson)))
      .to.deep.equal(getMinPkgJsonObj());
  });

  it("don't modify existing package.json.save", function () {
    expect(sh.cat(fxtPackageJsonSave).stdout).to.equal("pizza");
  });
};
