#!/usr/bin/env node

"use strict";

var sh = require("shelljs");

sh.set("-e");

var util = require("titor-util");

var config = util.loadConfig();

function main () {
  sh.echo("*** BEGIN TRAVIS");

  sh.exec("npm run build");

  if (config.coverReport) sh.cat("coverage/lcov.info").exec("coveralls");

  sh.echo("*** END TRAVIS");
}

main();
