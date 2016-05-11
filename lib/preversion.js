"use strict";

module.exports = function preversion (sh) {
  sh.set("-e");
  sh.echo("*** BEGIN PREVERSION");

  sh.exec("git checkout master");
  sh.exec("git merge dev");
  sh.exec("npm run build");
  sh.exec("git add -A");

  sh.echo("*** END PREVERSION");
  sh.set("+e");
};
