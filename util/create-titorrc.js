"use strict";

var sh = require("shelljs");

sh.set("-e");

var path = require("path");

module.exports = function createTitorrc (packageExport) {
  if (sh.test("-e", ".titorrc")) return false;

  if (typeof packageExport !== "string")
    throw Error("Missing or invalid packageExport");

  sh.sed(
    "PLACEHOLDER",
    packageExport,
    path.join(__dirname, "../resource/default.titorrc")
  ).to(".titorrc");

  return true;
};
