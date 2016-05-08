"use strict";

var sh = require("shelljs");

sh.set("-e");

var path = require("path");

module.exports = function createTestEslintrcYml () {
  if (sh.test("-e", "test/.eslintrc.yml")) return false;

  if (!sh.test("-e", "test")) sh.mkdir("test");

  sh.cp(
    path.join(__dirname, "../resource/default-test.eslintrc.yml"),
    "test/.eslintrc.yml"
  );

  return true;
};
