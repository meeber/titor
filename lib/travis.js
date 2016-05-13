"use strict";

var sh = require("shelljs");

module.exports = function travis (config) {
  sh.echo("*** BEGIN TRAVIS");

  // TODO: Refactor to call build lib function once ready
  sh.exec("npm run build");

  if (config.coverReport) sh.cat("coverage/lcov.info").exec("coveralls");

  sh.echo("*** END TRAVIS");
};
