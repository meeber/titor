"use strict";

var bundle = require("./bundle");
var clean = require("./clean");
var detectBuild = require("./detect-build");
var path = require("path");
var sh = require("shelljs");
var test = require("./test");

function copyBuildResources () {
  sh.cp(path.join(__dirname, "../resource/build/_index.js"), "build/index.js");
  sh.cp(path.join(__dirname, "../lib/detect-build.js"), "build/");
}

function createBuild (type) {
  sh.exec("BABEL_ENV=" + type + " babel"
        + " -s inline"
        + " -d " + path.join("build", type)
        + " src/");

  createBuildTest(type);
}

function createBuildTest (type) {
  sh.mkdir("-p", "build/" + type + "/test");

  sh.exec("BABEL_ENV=" + type + " babel"
        + " -s inline"
        + " -o " + path.join("build", type, "test/index.js")
        + " test/index.js");
}

module.exports = function build (types, config) {
  clean(["build"]);

  if (config.test) test(["src"], config);

  types.forEach(function _build (type) {
    sh.echo("*** BEGIN BUILD " + type);

    switch (type) {
      case "current":
      case "legacy":
        createBuild(type);
        break;
      default:
        throw Error("Invalid build: " + type);
    }

    sh.echo("*** END BUILD " + type);
  });

  copyBuildResources();

  if (config.test) test([detectBuild()], config);

  if (config.bundle) bundle(types, config);
  else clean(["bundle"]);
};
