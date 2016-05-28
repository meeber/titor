"use strict";

var expectTargetsToBeCleaned =
  require("../fixture/expect/expect-targets-to-be-cleaned");
var path = require("path");
var sh = require("shelljs");
var titor = require("../../api/titor");

var fxtBuild = path.join(fxt, "build");
var fxtBundle = path.join(fxt, "bundle");
var fxtCoverage = path.join(fxt, "coverage");

function defStandup (types) {
  minStandup();

  sh.mkdir(fxtBuild, fxtBundle, fxtCoverage);

  titor.clean(types);
}

describe("clean (api)", function () {
  describe("targets is 'build'", function () {
    before(function () { defStandup("build") });

    expectTargetsToBeCleaned(["build"]);

    after(teardown);
  });

  describe("targets is 'bundle'", function () {
    before(function () { defStandup("bundle") });

    expectTargetsToBeCleaned(["bundle"]);

    after(teardown);
  });

  describe("targets is 'coverage'", function () {
    before(function () { defStandup("coverage") });

    expectTargetsToBeCleaned(["coverage"]);

    after(teardown);
  });

  describe("targets is an array with 'build' and 'bundle'", function () {
    before(function () { defStandup(["build", "bundle"]) });

    expectTargetsToBeCleaned(["build", "bundle"]);

    after(teardown);
  });

  describe("targets is undefined", function () {
    before(function () { defStandup() });

    expectTargetsToBeCleaned(["build", "bundle", "coverage"]);

    after(teardown);
  });

  describe("targets is an empty array", function () {
    before(function () { defStandup([]) });

    expectTargetsToBeCleaned(["build", "bundle", "coverage"]);

    after(teardown);
  });

  describe("targets is a non-array object", function () {
    it("throw TypeError with descriptive message", function () {
      expect(function () { titor.clean({}) })
        .to.throw(TypeError, "Invalid clean targets");
    });
  });

  describe("targets isn't a string, object, or undefined", function () {
    it("throw TypeError with descriptive message", function () {
      expect(function () { titor.clean(42) })
        .to.throw(TypeError, "Invalid clean targets");
    });
  });

  describe("a target isn't 'build', 'bundle', or 'coverage'", function () {
    it("throw Error with descriptive message", function () {
      expect(function () { titor.clean("pizza") })
        .to.throw("Invalid clean target: pizza");
    });
  });
});
