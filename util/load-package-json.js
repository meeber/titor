"use strict";

var sh = require("shelljs");

sh.set("-e");

module.exports = function loadPackageJson () {
  return JSON.parse(sh.cat("package.json"));
};
