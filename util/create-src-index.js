"use strict";

var sh = require("shelljs");

sh.set("-e");

var path = require("path");

module.exports = function createSrcIndex (packageExport) {
  if (sh.test("-e", "src/index.js")) return false;

  if (typeof packageExport !== "string")
    throw Error("Missing or invalid packageExport");

  if (!sh.test("-e", "src")) sh.mkdir("src");

  sh.sed(
    "PLACEHOLDER",
    packageExport,
    path.join(__dirname, "../resource/default-src-index.js")
  ).to("src/index.js");

  return true;
};
