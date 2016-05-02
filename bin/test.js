#!/usr/bin/env node

"use strict";

var sh = require("shelljs");

sh.set("-e");

var util = require("titor-util");

var build = util.detectBuild();
var config = util.loadConfig();

function runBuildTest (test) {
  // Note: There isn't a legacy-shim test build. Instead, use legacy test build.
  // The shim gets added by build/legacy-shim.js which is required by bootstrap.

  var env = test.split("-")[0];

  sh.exec("mocha -c"
        + " -r " + __dirname + "/../test-bootstrap/" + test
        + " build/" + env + "/test/");
}

function runCoverageTest () {
  var tokens = build.split("-");
  var env = tokens[0];
  var shim = tokens[1] === "shim" ? "-r babel-polyfill" : "";

  sh.exec("npm run clean coverage");

  sh.exec("BABEL_ENV=" + env
        + " istanbul cover"
        + " --root src/"
        + " _mocha -- -c "
        + shim
        + " -r " + __dirname + "/../test-bootstrap/src"
        + " test/");

  sh.exec("npm run lint");
}

function runSrcTest () {
  var tokens = build.split("-");
  var env = tokens[0];
  var shim = tokens[1] === "shim" ? "-r babel-polyfill" : "";

  sh.exec("BABEL_ENV=" + env
        + " mocha -c "
        + shim
        + " -r " + __dirname + "/../test-bootstrap/src"
        + " test/");

  sh.exec("npm run lint");
}

function main () {
  var tests = process.argv.length > 2 ? process.argv.slice(2) : ["src", build];

  var i;

  for (i = 0; i < tests.length; i++) {
    sh.echo("*** BEGIN TEST " + tests[i]);

    switch (tests[i]) {
      case "coverage":
        runCoverageTest();
        break;
      case "current":
      case "legacy":
      case "legacy-shim":
        runBuildTest(tests[i]);
        break;
      case "src":
        runSrcTest();
        break;
      default:
        throw Error("Invalid test: " + tests[i]);
    }

    sh.echo("*** END TEST " + tests[i]);
  }
}

main();
