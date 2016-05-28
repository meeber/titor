"use strict";

var path = require("path");
var sh = require("shelljs");

var rscLintable = path.join(__dirname, "../resource/lintable.js");

module.exports = function createLintableJs (type) {
  var dir = path.join(fxt, type);

  if (!sh.test("-e", dir)) sh.mkdir(dir);

  sh.cp(rscLintable, path.join(dir, "lintable.js"));
};
