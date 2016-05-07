"use strict";

var sh = require("shelljs");

sh.set("-e");

var camelCase = require("camelcase");
var path = require("path");

module.exports = function createTitorrc () {
  if (sh.test("-e", ".titorrc")) return false;

  var packageJson = JSON.parse(sh.cat("package.json"));

  if (!packageJson.name) throw Error("Missing name in package.json");

  sh.sed(
    "PLACEHOLDER",
    camelCase(packageJson.name),
    path.join(__dirname, "../resource/default.titorrc")
  ).to(".titorrc");

  return true;
};
