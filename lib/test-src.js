"use strict";

var lint = require("../api/lint");
var path = require("path");
var sh = require("shelljs");

module.exports = function testSrc (isLint, detectedBuild) {
  var shim = detectedBuild === "legacy" ? "-r babel-polyfill" : "";

  var result = sh.exec("BABEL_ENV=" + detectedBuild
             + " mocha -c "
             + shim
             + " -r " + path.join("test/fixture/src")
             + " 'test/**/*.test.js'");

  if (isLint) lint();

  return result;
};
