"use strict";

var sh = require("shelljs");

var VALID_TARGETS = ["build", "bundle", "coverage"];

module.exports = function clean (targets) {
  switch (typeof targets) {
    case "object":
      if (!Array.isArray(targets)) throw TypeError("Invalid clean targets");
      if (!targets.length) targets = VALID_TARGETS;
      break;
    case "string":
      targets = [targets];
      break;
    case "undefined":
      targets = VALID_TARGETS;
      break;
    default:
      throw TypeError("Invalid clean targets");
  }

  targets.forEach(function cleanTarget (target) {
    if (VALID_TARGETS.indexOf(target) === -1)
      throw Error("Invalid clean target: " + target);

    sh.echo("*** BEGIN CLEAN " + target);

    sh.rm("-rf", target);

    sh.echo("*** END CLEAN " + target);
  });
};
