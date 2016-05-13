"use strict";

var sh = require("shelljs");

module.exports = function preversion () {
  sh.echo("*** BEGIN PREVERSION");

  sh.exec("git checkout master");
  sh.exec("git merge dev");
  sh.exec("npm run build");
  sh.exec("git add -A");

  sh.echo("*** END PREVERSION");
};
