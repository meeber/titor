"use strict";

var sh = require("shelljs");

sh.set("-e");

var path = require("path");

module.exports = function copyBabelrc () {
  if (sh.test("-e", ".babelrc")) return false;

  sh.cp(path.join(__dirname, "../resource/default.babelrc"), ".babelrc");

  return true;
};
