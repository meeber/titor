"use strict";

var expectTargetsToBeCleaned =
  require("../fixture/expect/expect-targets-to-be-cleaned");
var path = require("path");
var sh = require("shelljs");

var binTitorJs = path.join(__dirname, "../../bin/titor.js");
var fxtBuild = path.join(fxt, "build");
var fxtBundle = path.join(fxt, "bundle");
var fxtCoverage = path.join(fxt, "coverage");

function defStandup (types) {
  standup();

  sh.mkdir(fxtBuild, fxtBundle, fxtCoverage);

  sh.exec(binTitorJs + " clean " + types);
}

describe("clean (bin)", function () {
  describe("args is 'build'", function () {
    before(function () { defStandup("build") });

    expectTargetsToBeCleaned(["build"]);

    after(teardown);
  });

  describe("args is 'bundle'", function () {
    before(function () { defStandup("bundle") });

    expectTargetsToBeCleaned(["bundle"]);

    after(teardown);
  });

  describe("args is 'coverage'", function () {
    before(function () { defStandup("coverage") });

    expectTargetsToBeCleaned(["coverage"]);

    after(teardown);
  });

  describe("args is 'build bundle'", function () {
    before(function () { defStandup("build bundle") });

    expectTargetsToBeCleaned(["build", "bundle"]);

    after(teardown);
  });

  describe("args is provided", function () {
    before(function () { defStandup("") });

    expectTargetsToBeCleaned(["build", "bundle", "coverage"]);

    after(teardown);
  });

  describe("an arg isn't 'build', 'bundle', or 'coverage'", function () {
    var result;

    before(function () {
      standup();

      sh.set("+e");

      result = sh.exec(binTitorJs + " clean pizza");
    });

    it("terminate with exit code 1", function () {
      expect(result).to.have.property("code", 1);
    });

    it("output descriptive message to stderr", function () {
      expect(result.stderr).to.match(/Invalid clean target: pizza/);
    });

    after(function () {
      teardown();

      sh.set("-e");
    });
  });
});
