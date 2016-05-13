"use strict";

var sh = require("shelljs");

module.exports = function main (version) {
  sh.echo("*** BEGIN RELEASE " + version);

  sh.exec("npm version " + version + " -m 'Finalize v%s'");

  sh.echo("*** END RELEASE " + version);
};
