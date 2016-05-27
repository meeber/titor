"use strict";

var path = require("path");
var sh = require("shelljs");

module.exports = function testBuild (type) {
  return sh.exec("mocha -c"
               + " -r " + path.join("test/fixture", type)
               + " " + path.join("build", type, "test"));
};
