#!/usr/bin/env node

"use strict";

var sh = require("shelljs");

sh.set("-e");

var util = require("titor-util");

var config = util.loadConfig();

function createBundle (bundle) {
  // Note: The legacy-shim and legacy bootstrap/test are identical. The shim for
  // legacy-shim is provided via its bundle.js; it will apply to tests too.

  var env = bundle.split("-")[0];

  sh.mkdir("-p", "bundle/" + bundle + "/test/");

  var buildBundleMap = "bundle/" + bundle + "/bundle.js.map";

  sh.exec("browserify"
        + " -d"
        + " -s " + config.mainExport
        + " build/" + bundle
        + " | exorcist " + buildBundleMap
        + " > bundle/" + bundle + "/bundle.js");

  // TODO: Remove this if exorcist updated to throw errors
  if (!sh.test("-e", buildBundleMap))
    throw Error("Failed to create " + buildBundleMap);

  sh.exec("browserify"
        + " -d "
        + __dirname + "/../test-bootstrap/common.js"
        + " -o bundle/" + bundle + "/test/bootstrap.js");

  var testBundleMap = "bundle/" + bundle + "/test/test.js.map";

  sh.exec("browserify"
        + " -d"
        + " build/" + env + "/test/"
        + " | exorcist " + testBundleMap
        + " > bundle/" + bundle + "/test/test.js");

  // TODO: Remove this if exorcist updated to throw errors
  if (!sh.test("-e", testBundleMap))
    throw Error("Failed to create " + testBundleMap);

  sh.cp(
    "node_modules/mocha/mocha.css",
    "node_modules/mocha/mocha.js",
    "bundle/" + bundle + "/test/"
  );

  sh.cp(
    __dirname + "/../resource/test.html",
    "bundle/" + bundle + "/test/index.html"
  );
}

function main () {
  sh.exec("npm run clean bundle");

  var bundles = ["current", "legacy", "legacy-shim"];

  var i;

  for (i = 0; i < bundles.length; i++) {
    sh.echo("*** BEGIN BUNDLE " + bundles[i]);

    switch (bundles[i]) {
      case "current":
      case "legacy":
      case "legacy-shim":
        createBundle(bundles[i]);
        break;
      default:
        throw Error("Invalid bundle: " + bundles[i]);
    }

    sh.echo("*** END BUNDLE " + bundles[i]);
  }
}

main();
