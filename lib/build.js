"use strict";

var bundle = require("./bundle");
var clean = require("./clean");
var createResource = require("./create-resource");
var decamelize = require("decamelize");
var detectBuild = require("./detect-build");
var path = require("path");
var sh = require("shelljs");
var test = require("./test");

function copyBuildResources (pkgExport) {
  sh.cp(path.join(__dirname, "../lib/detect-build.js"), "build/");
  createResource("build/index.js");
  createResource("build/current.js", decamelize(pkgExport, "-"));
  createResource("build/legacy.js", decamelize(pkgExport, "-"));
}

function createBuild (type, pkgExport) {
  sh.exec("BABEL_ENV=" + type + " babel"
        + " -s inline"
        + " -d " + path.join("build", type)
        + " src/");

  createBuildTest(type, pkgExport);
}

function createBuildTest (type, pkgExport) {
  var pkgExportTest = "test/" + decamelize(pkgExport, "-") + ".js";

  sh.mkdir("-p", "build/" + type + "/test");

  sh.exec("BABEL_ENV=" + type + " babel"
        + " -s inline"
        + " -o " + path.join("build", type, pkgExportTest)
        + " " + pkgExportTest);
}

module.exports = function build (types, config) {
  clean(["build"]);

  if (config.test) test(["src"], config);

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

  if (config.test) test([detectBuild()], config);

  if (config.bundle) bundle(types, config);
  else clean(["bundle"]);
};