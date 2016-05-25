"use strict";

var path = require("path");
var sh = require("shelljs");

var TARGETS = ["build", "bundle", "coverage"];

module.exports = function expectTargetsToBeCleaned (targets) {
  TARGETS.forEach(function (target) {
    var fxtTarget = path.join(fxt, target);
    var shouldTargetExist = targets.indexOf(target) === -1;

    var description = (shouldTargetExist ? "don't " : "")
                    + "remove " + target + " directory";

    it(description, function () {
      expect(sh.test("-e", fxtTarget)).to.equal(shouldTargetExist);
    });
  });
};
