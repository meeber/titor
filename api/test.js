"use strict";

var clean = require("./clean");
var detectBuild = require("../util/detect-build");
var lint = require("./lint");
var path = require("path");
var sh = require("shelljs");

function testBuild (type) {
  sh.exec("mocha -c --recursive"
        + " -r " + path.join(__dirname, "../test-bootstrap", type)
        + " " + path.join("build", type, "test"));
}

function testSrc (isLint, detectedBuild) {
  sh.exec("BABEL_ENV=" + detectedBuild
        + " mocha -c "
        + " -r " + path.join(__dirname, "../test-bootstrap/src")
        + " test/");

  if (isLint) lint();
}

function testSrcCover (isLint, detectedBuild) {
  clean("coverage");

  sh.exec("BABEL_ENV=" + detectedBuild
        + " istanbul cover"
        + " --report lcovonly"
        + " --root src/"
        + " _mocha -- -c "
        + " -r " + path.join(__dirname, "../test-bootstrap/src")
        + " test/");

  if (isLint) lint();
}

module.exports = function test (types, config) {
  switch (typeof types) {
    case "object":
      if (!Array.isArray(types)) throw TypeError("Invalid test types");
      if (!types.length) types.push("src");
      break;
    case "string":
      types = [types];
      break;
    case "undefined":
      types = ["src"];
      break;
    default:
      throw TypeError("Invalid test types");
  }

  var detectedBuild = detectBuild();

  types.forEach(function _test (type) {
    sh.echo("*** BEGIN TEST " + type);

    switch (type) {
      case "current":
      case "legacy":
        testBuild(type);
        break;
      case "src":
        if (config.cover) testSrcCover(config.lint, detectedBuild);
        else testSrc(config.lint, detectedBuild);
        break;
      default:
        throw Error("Invalid test: " + type);
    }

    sh.echo("*** END TEST " + type);
  });
};
