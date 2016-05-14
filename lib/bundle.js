#!/usr/bin/env node
"use strict";

var clean = require("./clean");
var path = require("path");
var sh = require("shelljs");

function copyTestBundleResources (type) {
  sh.cp(
    path.join(__dirname, "../resource/bundle/_mocha.css"),
    path.join("bundle", type, "test/mocha.css")
  );

  sh.cp(
    path.join(__dirname, "../resource/bundle/_mocha.js"),
    path.join("bundle", type, "test/mocha.js")
  );

  sh.cp(
    path.join(__dirname, "../resource/bundle/_test.html"),
    path.join("bundle", type, "test/index.html")
  );
}

function createBuildBundle (type, pkgExport) {
  var buildBundleMap = path.join("bundle", type, "bundle.js.map");

  sh.exec("browserify"
        + " -d"
        + " -s " + pkgExport
        + " build/" + type
        + " | exorcist " + buildBundleMap
        + " > " + path.join("bundle", type, "bundle.js"));

  // TODO: Remove this if exorcist updated to throw errors
  if (!sh.test("-e", buildBundleMap))
    throw Error("Failed to create " + buildBundleMap);
}

function createBundles (type, pkgExport) {
  sh.mkdir("-p", path.join("bundle", type, "test"));

  createBuildBundle(type, pkgExport);
  createTestBootstrapBundle(type);
  createTestBundle(type);
  copyTestBundleResources(type);
}

function createTestBootstrapBundle (type) {
  var shim = type === "legacy" ? "-r babel-polyfill" : "";

  sh.exec("browserify "
        + shim
        + " -d "
        + path.join(__dirname, "../test-bootstrap/common.js")
        + " -o " + path.join("bundle", type, "test/bootstrap.js"));
}

function createTestBundle (type) {
  var testBundleMap = path.join("bundle", type, "test/test.js.map");

  sh.exec("browserify"
        + " -d "
        + path.join("build", type, "test/")
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
