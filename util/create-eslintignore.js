"use strict";

var sh = require("shelljs");

sh.set("-e");

var path = require("path");

module.exports = function createEslintignore () {
  if (sh.test("-e", ".eslintignore")) return false;

  sh.cp(
    path.join(__dirname, "../resource/default.eslintignore"),
    ".eslintignore"
  );

  return true;
};
