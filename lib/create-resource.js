"use strict";

var path = require("path");
var sh = require("shelljs");

module.exports = function createResource (dstPath, pkgExport, srcPath) {
  if (sh.test("-e", dstPath)) return false;

  var dstDir = path.dirname(dstPath);
  var dstFile = path.basename(dstPath);

  if (!sh.test("-e", dstDir)) sh.mkdir(dstDir);

  var srcPath = srcPath
             || path.join(__dirname, "../resource", dstDir, "_" + dstFile);

  if (typeof pkgExport === "undefined") sh.cp(srcPath, dstPath);
  else sh.sed("PACKAGE_EXPORT", pkgExport, srcPath).to(dstPath);

  return true;
};
