"use strict";

var sh = require("shelljs");

sh.set("-e");

var path = require("path");

module.exports = function createTitorrcYml (packageExport) {
  if (sh.test("-e", ".titorrc.yml")) return false;

  if (typeof packageExport !== "string")
    throw Error("Missing or invalid packageExport");

  sh.sed(
    "PLACEHOLDER",
    packageExport,
    path.join(__dirname, "../resource/default.titorrc.yml")
  ).to(".titorrc.yml");

  return true;
};
