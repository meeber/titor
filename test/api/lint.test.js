"use strict";

var createLintableJs = require("../fixture/helper/create-lintable-js");
var expectLintableFixed = require("../fixture/expect/expect-lintable-fixed");
var expectLintableNotFixed =
  require("../fixture/expect/expect-lintable-not-fixed");
var titor = require("../../api/titor");

describe("lint (api)", function () {
  describe("a .js file exists in src/ with a fixable issue", function () {
    before(function () {
      standup();

      createLintableJs("src");

      titor.lint();
    });

    expectLintableFixed("src");

    after(teardown);
  });

  describe("a .js file exists in build/ with a fixable issue", function () {
    before(function () {
      standup();

      createLintableJs("build");

      titor.lint();
    });

    expectLintableNotFixed("build");

    after(teardown);
  });
});
