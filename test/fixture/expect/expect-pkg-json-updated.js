"use strict";

var getMinPkgJsonObj = require("../helper/get-min-pkg-json-obj");
var getSetupPkgJsonObj = require("../helper/get-setup-pkg-json-obj");
var path = require("path");
var sh = require("shelljs");

var fxtPackageJson = path.join(fxt, "package.json");
var fxtPackageJsonSave = fxtPackageJson + ".save";

module.exports = function expectPkgJsonUpdated () {
  it("move package.json to package.json.save", function () {
    expect(JSON.parse(sh.cat(fxtPackageJsonSave)))
      .to.deep.equal(getMinPkgJsonObj());
  });

  it("create package.json with setup object", function () {
    expect(JSON.parse(sh.cat(fxtPackageJson)))
      .to.deep.equal(getSetupPkgJsonObj());
  });
};
