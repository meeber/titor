#!/usr/bin/env node

"use strict";

var sh = require("shelljs");

sh.set("-e");

var configurePath = require("../lib/configure-path");
var detectBuild = require("../lib/detect-build");
var loadConfig = require("../lib/load-config");
var path = require("path");

var config = loadConfig();
var detectedBuild = detectBuild();

function createBuild (build) {
  sh.exec("BABEL_ENV=" + build + " babel"
        + " -s inline"
        + " -d " + path.join("build", build)
        + " src/");

  sh.mkdir("build/" + build + "/test");

  sh.exec("BABEL_ENV=" + build + " babel"
        + " -s inline"
        + " -o " + path.join("build", build, "test/index.js")
        + " test/index.js");
}

function main () {
  configurePath();

  sh.exec("npm run clean build");

  if (config.test) sh.exec("npm run test src");

  var builds = ["current", "legacy"];

  var i;

  for (i = 0; i < builds.length; i++) {
    sh.echo("*** BEGIN BUILD " + builds[i]);

    switch (builds[i]) {
      case "current":
      case "legacy":
        createBuild(builds[i]);
        break;
      default:
        throw Error("Invalid build: " + builds[i]);
    }

    sh.cp(
      path.join(__dirname, "../resource/build/_index.js"),
      "build/index.js"
    );
    sh.cp(path.join(__dirname, "../lib/detect-build.js"), "build/");

    sh.echo("*** END BUILD " + builds[i]);
  }

  if (config.test) sh.exec("npm run test " + detectedBuild);

  if (config.bundle) sh.exec("npm run bundle");
  else sh.exec("npm run clean bundle");
}

main();
