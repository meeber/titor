#!/usr/bin/env node

"use strict";

var sh = require("shelljs");

sh.set("-e");

var loadConfig = require("../util/load-config");
var path = require("path");

var config = loadConfig();

function createBundle (bundle) {
  sh.mkdir("-p", path.join("bundle", bundle, "test"));

  var buildBundleMap = path.join("bundle", bundle, "bundle.js.map");

  sh.exec("browserify"
        + " -d"
        + " -s " + config.export
        + " build/" + bundle
        + " | exorcist " + buildBundleMap
        + " > " + path.join("bundle", bundle, "bundle.js"));

  // TODO: Remove this if exorcist updated to throw errors
  if (!sh.test("-e", buildBundleMap))
    throw Error("Failed to create " + buildBundleMap);

  var shim = bundle === "legacy" ? "-r babel-polyfill" : "";

  sh.exec("browserify "
        + shim
        + " -d "
        + path.join(__dirname, "../test-bootstrap/common.js")
        + " -o " + path.join("bundle", bundle, "test/bootstrap.js"));

  var testBundleMap = path.join("bundle", bundle, "test/test.js.map");

  sh.exec("browserify"
        + " -d "
        + path.join("build", bundle, "test/")
        + " | exorcist " + testBundleMap
        + " > " + path.join("bundle", bundle, "test/test.js"));

  // TODO: Remove this if exorcist updated to throw errors
  if (!sh.test("-e", testBundleMap))
    throw Error("Failed to create " + testBundleMap);

  sh.cp(
    "node_modules/mocha/mocha.css",
    "node_modules/mocha/mocha.js",
    path.join("bundle", bundle, "test")
  );

  sh.cp(
    path.join(__dirname, "../resource/bundle/_test.html"),
    path.join("bundle", bundle, "test/index.html")
  );
}

function main () {
  sh.exec("npm run clean bundle");

  var bundles = ["current", "legacy"];

  var i;

  for (i = 0; i < bundles.length; i++) {
    sh.echo("*** BEGIN BUNDLE " + bundles[i]);

    switch (bundles[i]) {
      case "current":
      case "legacy":
        createBundle(bundles[i]);
        break;
      default:
        throw Error("Invalid bundle: " + bundles[i]);
    }

    sh.echo("*** END BUNDLE " + bundles[i]);
  }
}

main();
