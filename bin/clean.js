#!/usr/bin/env node

"use strict";

var sh = require("shelljs");

sh.set("-e");

function main () {
  var targets = process.argv.length > 2 ? process.argv.slice(2)
              : ["build", "bundle", "coverage"];

  var i;

  for (i = 0; i < targets.length; i++) {
    sh.echo("*** BEGIN CLEAN " + targets[i]);

    switch (targets[i]) {
      case "bundle":
      case "build":
      case "coverage":
        sh.rm("-rf", targets[i]);
        break;
      default:
        throw Error("Invalid target: " + targets[i]);
    }

    sh.echo("*** END CLEAN " + targets[i]);
  }
}

main();
