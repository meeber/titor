"use strict";

var chai = require("chai");
var path = require("path");
var sh = require("shelljs");

sh.set("-e");

function doStandup (srcRoot) {
  if (sh.test("-e", tmpRoot)) sh.rm("-rf", tmpRoot);

  sh.cp("-r", path.join(__dirname, srcRoot), tmpRoot);
  sh.cd(tmpRoot);
}

global.expect = chai.expect;

global.maxStandup = function maxStandup () { doStandup("_max-root") };
global.minStandup = function minStandup () { doStandup("_min-root") };
global.standup = function standup () { doStandup("_root") };

global.tmpRoot = path.join(sh.tempdir(), "titor-test-root");

global.teardown = function teardown () {
  sh.cd(__dirname);
  sh.rm("-rf", tmpRoot);
};
