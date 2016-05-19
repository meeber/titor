"use strict";

var build = require("./build");
var sh = require("shelljs");

module.exports = function travis (config) {
  sh.echo("*** BEGIN TRAVIS");

  build(["current", "legacy"], config);

  if (config.coverReport) sh.cat("coverage/lcov.info").exec("coveralls");

  sh.echo("*** END TRAVIS");
};
