"use strict";

module.exports = function main (version, sh) {
  sh.set("-e");
  sh.echo("*** BEGIN RELEASE " + version);

  sh.exec("npm version " + version + " -m 'Finalize v%s'");

  sh.echo("*** END RELEASE " + version);
  sh.set("+e");
};
