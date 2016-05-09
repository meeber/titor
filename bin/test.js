#!/usr/bin/env node

"use strict";

var sh = require("shelljs");

sh.set("-e");

var configurePath = require("../util/configure-path");
var detectBuild = require("../util/detect-build");
var loadConfig = require("../util/load-config");
var path = require("path");

var build = detectBuild();
var config = loadConfig();

function runBuildTest (test) {
  sh.exec("mocha -c"
        + " -r " + path.join(__dirname, "../test-bootstrap", test)
        + " " + path.join("build", build, "test"));
}

function runCoverTest () {
  sh.exec("npm run clean coverage");

  sh.exec("BABEL_ENV=" + build
        + " istanbul cover"
        + " --report lcovonly"
        + " --root src/"
        + " _mocha -- -c "
        + " -r " + path.join(__dirname, "../test-bootstrap/src")
        + " test/");

  if (config.lint) sh.exec("npm run lint");
}

function runSrcTest () {
  sh.exec("BABEL_ENV=" + build
        + " mocha -c "
        + " -r " + path.join(__dirname, "../test-bootstrap/src")
        + " test/");

  if (config.lint) sh.exec("npm run lint");
}

function main () {
  configurePath();

  var tests = process.argv.length > 2 ? process.argv.slice(2) : ["src", build];

  var i;

  for (i = 0; i < tests.length; i++) {
    sh.echo("*** BEGIN TEST " + tests[i]);

    switch (tests[i]) {
      case "current":
      case "legacy":
        runBuildTest(tests[i]);
        break;
      case "src":
        if (config.cover) runCoverTest();
        else runSrcTest();
        break;
      default:
        throw Error("Invalid test: " + tests[i]);
    }

    sh.echo("*** END TEST " + tests[i]);
  }
}

main();
