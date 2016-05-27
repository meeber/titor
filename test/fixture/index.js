"use strict";

var chai = require("chai");
var path = require("path");
var sh = require("shelljs");
var titor = require("../../api/titor");

sh.set("-e");
sh.config.silent = true;
sh.echo = function () {};

global.expect = chai.expect;

global.maxStandup = function maxStandup () {
  standup();
  titor.build(["current", "legacy"], {export: "testPackage"});
};

global.minStandup = function minStandup () {
  if (sh.test("-e", fxt)) sh.rm("-rf", fxt);

  sh.cp("-r", path.join(__dirname, "_root"), fxt);
  sh.cd(fxt);
};

global.standup = function standup () {
  minStandup();
  titor.setup();
  sh.ln(
    "-s",
    path.join(__dirname, "../../node_modules"),
    path.join(fxt, "node_modules")
  );
};

global.fxt = path.join(sh.tempdir(), "titor-test-root");

global.teardown = function teardown () {
  sh.cd(__dirname);
  sh.rm("-rf", fxt);
};
