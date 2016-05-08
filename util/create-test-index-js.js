"use strict";

var sh = require("shelljs");

sh.set("-e");

var path = require("path");

module.exports = function createTestIndexJs (packageExport) {
  if (sh.test("-e", "test/index.js")) return false;

  if (typeof packageExport !== "string")
    throw Error("Missing or invalid packageExport");

  if (!sh.test("-e", "test")) sh.mkdir("test");

  sh.sed(
    "PLACEHOLDER",
    packageExport,
    path.join(__dirname, "../resource/default-test-index.js")
  ).to("test/index.js");

  return true;
};
