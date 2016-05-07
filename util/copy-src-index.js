"use strict";

var sh = require("shelljs");

sh.set("-e");

var camelCase = require("camelcase");
var path = require("path");

module.exports = function copySrcIndex () {
  if (sh.test("-e", "src/index.js")) return false;

  var packageJson = JSON.parse(sh.cat("package.json"));

  if (!packageJson.name) throw Error("Missing name in package.json");

  if (!sh.test("-e", "src")) sh.mkdir("src");

  sh.sed(
    "PLACEHOLDER",
    camelCase(packageJson.name),
    path.join(__dirname, "../resource/default-src-index.js")
  ).to("src/index.js");

  return true;
};
