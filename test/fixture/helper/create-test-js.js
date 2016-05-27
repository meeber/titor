"use strict";

var path = require("path");
var sh = require("shelljs");

var DIRS = {
  current: path.join(fxt, "build/current/test"),
  legacy: path.join(fxt, "build/legacy/test"),
  src: path.join(fxt, "src"),
};

var rscBadTestJs = path.join(__dirname, "../resource/bad-test.js");
var rscGoodTestJs = path.join(__dirname, "../resource/good-test.js");

module.exports = function createTestJs (type, isBad) {
  var rscTestJs = isBad ? rscBadTestJs : rscGoodTestJs;

  sh.mkdir("-p", DIRS[type]);
  sh.cp(rscTestJs, path.join(DIRS[type], "test-package.test.js"));
};
