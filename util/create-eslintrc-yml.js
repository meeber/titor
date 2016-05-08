"use strict";

var sh = require("shelljs");

sh.set("-e");

var path = require("path");

module.exports = function createEslintrcYml () {
  if (sh.test("-e", ".eslintrc.yml")) return false;

  sh.cp(
    path.join(__dirname, "../resource/default.eslintrc.yml"),
    ".eslintrc.yml"
  );

  return true;
};
