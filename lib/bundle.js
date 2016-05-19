#!/usr/bin/env node
"use strict";

var clean = require("./clean");
var createResource = require("./create-resource");
var decamelize = require("decamelize");
var path = require("path");
var sh = require("shelljs");

function createTestBundleResources (type, pkgExport) {
  createResource(
    path.join("bundle", type, "test/mocha.css"),
    undefined,
    path.join(__dirname, "../resource/bundle/_mocha.css")
  );

  createResource(
    path.join("bundle", type, "test/mocha.js"),
    undefined,
    path.join(__dirname, "../resource/bundle/_mocha.js")
  );

  createResource(
    path.join("bundle", type, "test/index.html"),
    decamelize(pkgExport, "-"),
    path.join(__dirname, "../resource/bundle/_test.html")
  );
}

function createBuildBundle (type, pkgExport) {
  var buildBundle = path.join(
    "bundle",
    type,
    decamelize(pkgExport, "-") + ".js"
  );
  var buildBundleMap = buildBundle + ".map";

  sh.exec("browserify"
        + " -d"
        + " -s " + pkgExport
        + " build/" + type
        + " | exorcist " + buildBundleMap
        + " > " + buildBundle);

  // TODO: Remove this if exorcist updated to throw errors
  if (!sh.test("-e", buildBundleMap))
    throw Error("Failed to create " + buildBundleMap);
}

function createBundles (type, pkgExport) {
  sh.mkdir("-p", path.join("bundle", type, "test"));

  createBuildBundle(type, pkgExport);
  createTestBootstrapBundle(type);
  createTestBundle(type, pkgExport);
  createTestBundleResources(type, pkgExport);
}

function createTestBootstrapBundle (type) {
  var shim = type === "legacy" ? "-r babel-polyfill" : "";

  sh.exec("browserify "
        + shim
        + " -d "
        + path.join(__dirname, "../test-bootstrap/common.js")
        + " -o " + path.join("bundle", type, "test/bootstrap.js"));
}

function createTestBundle (type, pkgExport) {
  var testBundleMap = path.join("bundle", type, "test/test.js.map");

  sh.exec("browserify"
        + " -d "
        + path.join("build", type, "test", decamelize(pkgExport, "-"))
        + " | exorcist " + testBundleMap
        + " > " + path.join("bundle", type, "test/test.js"));

  // TODO: Remove this if exorcist updated to throw errors
  if (!sh.test("-e", testBundleMap))
    throw Error("Failed to create " + testBundleMap);
}

module.exports = function bundle (types, config) {
  clean(["bundle"]);

  types.forEach(function _bundle (type) {
    sh.echo("*** BEGIN BUNDLE " + type);

    switch (type) {
      case "current":
      case "legacy":
        createBundles(type, config.export);
        break;
      default:
        throw Error("Invalid bundle: " + type);
    }

    sh.echo("*** END BUNDLE " + type);
  });
};