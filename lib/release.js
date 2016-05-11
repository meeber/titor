"use strict";

module.exports = function main (version, sh) {
  sh.echo("*** BEGIN RELEASE " + version);

  sh.exec("npm version " + version + " -m 'Finalize v%s'");

  sh.echo("*** END RELEASE " + version);
};
