"use strict";

var chai = require("chai");
var path = require("path");
var setup = require("../../api/setup");
var sh = require("shelljs");

sh.set("-e");
sh.config.silent = true;
sh.echo = function () {};

global.expect = chai.expect;

global.minStandup = function minStandup () {
  if (sh.test("-e", fxt)) sh.rm("-rf", fxt);

  sh.cp("-r", path.join(__dirname, "_root"), fxt);
  sh.cd(fxt);
};

global.standup = function standup () {
  minStandup();
  setup();
};

global.fxt = path.join(sh.tempdir(), "titor-test-root");

global.teardown = function teardown () {
  sh.cd(__dirname);
  sh.rm("-rf", fxt);
};
