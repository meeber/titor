"use strict";

var sh = require("shelljs");

module.exports = function lint () {
  sh.echo("*** BEGIN LINT");

  sh.exec("eslint --color --fix .");

  sh.echo("*** END LINT");
};
