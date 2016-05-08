"use strict";

var sh = require("shelljs");

sh.set("-e");

var path = require("path");

module.exports = function createTravisYml () {
  if (sh.test("-e", ".travis.yml")) return false;

  sh.cp(path.join(__dirname, "../resource/default.travis.yml"), ".travis.yml");

  return true;
};
