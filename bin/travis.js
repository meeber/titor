#!/usr/bin/env node

"use strict";

var sh = require("shelljs");

sh.set("-e");

var configurePath = require("../util/configure-path");
var loadConfig = require("../util/load-config");

var config = loadConfig();

function main () {
  configurePath();

  sh.echo("*** BEGIN TRAVIS");

  sh.exec("npm run build");

  if (config.coverReport) sh.cat("coverage/lcov.info").exec("coveralls");

  sh.echo("*** END TRAVIS");
}

main();
