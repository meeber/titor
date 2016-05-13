"use strict";

var path = require("path");
var sh = require("shelljs");

module.exports = function loadPackageJson (dir) {
  var packageJson = dir ? path.join(dir, "package.json") : "package.json";

  return JSON.parse(sh.cat(packageJson));
};
