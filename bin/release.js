#!/usr/bin/env node

"use strict";

var sh = require("shelljs");

sh.set("-e");

function main () {
  var version = process.argv.length > 2 ? process.argv[3] : "";

  sh.echo("*** BEGIN RELEASE " + version);

  sh.exec("npm version " + version + " -m 'Finalize v%s'");

  sh.echo("*** END RELEASE " + version);
}

main();
