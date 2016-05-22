"use strict";

var chai = require("chai");
var path = require("path");
var sh = require("shelljs");

sh.set("-e");

function doStandup (min) {
  if (sh.test("-e", tmpRoot)) sh.rm("-rf", tmpRoot);

  var srcSubDir = min ? "_min-root" : "_root";

  sh.cp("-r", path.join(__dirname, srcSubDir), tmpRoot);
  sh.cd(tmpRoot);
}

global.expect = chai.expect;

global.minStandup = function minStandup () { doStandup(true) };

global.standup = function standup () { doStandup() };

global.tmpRoot = path.join(sh.tempdir(), "titor-test-root");

global.teardown = function teardown () {
  sh.cd(__dirname);
  sh.rm("-rf", tmpRoot);
};
