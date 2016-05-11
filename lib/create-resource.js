"use strict";

var sh = require("shelljs");

sh.set("-e");

var path = require("path");

module.exports = function createResource (dstPath, packageExport) {
  if (sh.test("-e", dstPath)) return false;

  var dstDir = path.dirname(dstPath);
  var dstFile = path.basename(dstPath);

  if (!sh.test("-e", dstDir)) sh.mkdir(dstDir);

  var srcPath = path.join(__dirname, "../resource", dstDir, "_" + dstFile);

  if (typeof packageExport === "undefined") sh.cp(srcPath, dstPath);
  else sh.sed("PACKAGE_EXPORT", packageExport, srcPath).to(dstPath);

  return true;
};
