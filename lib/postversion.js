"use strict";

module.exports = function postversion (sh) {
  sh.set("-e");
  sh.echo("*** BEGIN POSTVERSION");

  sh.exec("git checkout dev");
  sh.exec("git merge master");
  sh.exec("git push");
  sh.exec("git push --tags");
  sh.exec("npm publish");

  sh.echo("*** END POSTVERSION");
  sh.set("+e");
};
