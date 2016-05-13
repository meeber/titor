"use strict";

var VALID_TARGETS = ["build", "bundle", "coverage"];

module.exports = function clean (targets, sh) {
  sh.set("-e");

  targets.forEach(function cleanTarget (target) {
    if (VALID_TARGETS.indexOf(target) === -1)
      throw Error("Invalid clean target: " + target);

    sh.echo("*** BEGIN CLEAN " + target);

    sh.rm("-rf", target);

    sh.echo("*** END CLEAN " + target);
  });

  sh.set("+e");
};
