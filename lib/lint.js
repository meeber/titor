"use strict";

module.exports = function lint (sh) {
  sh.set("-e");
  sh.echo("*** BEGIN LINT");

  sh.exec("eslint --color --fix .");

  sh.echo("*** END LINT");
  sh.set("+e");
};
