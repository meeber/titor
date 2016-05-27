"use strict";

var bundle = require("./bundle");
var clean = require("./clean");
var createResource = require("../lib/create-resource");
var decamelize = require("decamelize");
var detectBuild = require("../lib/detect-build");
var path = require("path");
var sh = require("shelljs");
var test = require("./test");

function copyBuildResources (pkgExport) {
  sh.cp(path.join(__dirname, "../lib/detect-build.js"), "build/");
  createResource("build/index.js");
  createResource("build/current/index.js", pkgExport);
  createResource("build/legacy/index.js", pkgExport);
}

function createBuild (type, pkgExport) {
  sh.exec("BABEL_ENV=" + type + " babel"
        + " -s inline"
        + " -d " + path.join("build", type, "src")
        + " src/");

  createBuildTest(type, pkgExport);
}

function createBuildTest (type, pkgExport) {
  var pkgExportTest = "test/" + decamelize(pkgExport, "-") + ".test.js";

  sh.mkdir("-p", path.join("build", type, "test"));

  sh.exec("BABEL_ENV=" + type + " babel"
        + " -s inline"
        + " -o " + path.join("build", type, pkgExportTest)
        + " " + pkgExportTest);
}

module.exports = function build (types, config) {
  switch (typeof types) {
    case "object":
      if (!Array.isArray(types)) throw TypeError("Invalid build types");
      if (!types.length) types.push("current", "legacy");
      break;
    case "string":
      types = [types];
      break;
    case "undefined":
      types = ["current", "legacy"];
      break;
    default:
      throw TypeError("Invalid build types");
  }

  clean("build");

  if (config.test) test("src", config);

  types.forEach(function _build (type) {
    sh.echo("*** BEGIN BUILD " + type);

    switch (type) {
      case "current":
      case "legacy":
        createBuild(type, config.export);
        break;
      default:
        throw Error("Invalid build: " + type);
    }

    sh.echo("*** END BUILD " + type);
  });

  copyBuildResources(config.export);

  if (config.test) test(detectBuild(), config);

  if (config.bundle) bundle(types, config);
  else clean("bundle");
};
