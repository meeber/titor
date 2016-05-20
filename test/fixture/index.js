"use strict";

var chai = require("chai");
var path = require("path");
var sh = require("shelljs");

sh.set("-e");

global.expect = chai.expect;
global.tmpRoot = path.join(sh.tempdir(), "titor-test-root");

global.standup = function standup () {
  if (sh.test("-e", tmpRoot)) sh.rm("-rf", tmpRoot);

  sh.cp("-r", path.join(__dirname, "_root"), tmpRoot);
  sh.cd(tmpRoot);
};

global.teardown = function teardown () {
  sh.cd(__dirname);
  sh.rm("-rf", tmpRoot);
};
