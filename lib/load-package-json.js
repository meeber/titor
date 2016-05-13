"use strict";

var path = require("path");

module.exports = function loadPackageJson (dir, sh) {
  if (typeof dir === "object") {
    sh = dir;
    dir = undefined;
  }

  var packageJson = dir ? path.join(dir, "package.json") : "package.json";

  return JSON.parse(sh.cat(packageJson));
};
