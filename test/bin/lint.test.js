"use strict";

var createLintableJs = require("../fixture/helper/create-lintable-js");
var expectLintableFixed = require("../fixture/expect/expect-lintable-fixed");
var expectLintableNotFixed =
  require("../fixture/expect/expect-lintable-not-fixed");
var path = require("path");
var sh = require("shelljs");

var binTitorJs = path.join(__dirname, "../../bin/titor.js");

describe("lint (bin)", function () {
  describe("a .js file exists in src/ with a fixable issue", function () {
    before(function () {
      standup();

      createLintableJs("src");

      sh.exec(binTitorJs + " lint");
    });

    expectLintableFixed("src");

    after(teardown);
  });

  describe("a .js file exists in build/ with a fixable issue", function () {
    before(function () {
      standup();

      createLintableJs("build");

      sh.exec(binTitorJs + " lint");
    });

    expectLintableNotFixed("build");

    after(teardown);
  });
});
