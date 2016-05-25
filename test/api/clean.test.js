"use strict";

var clean = require("../../api/clean");
var expectCleaned = require("../fixture/share/expect-cleaned");
var path = require("path");
var sh = require("shelljs");

var fxtBuild = path.join(fxt, "build");
var fxtBundle = path.join(fxt, "bundle");
var fxtCoverage = path.join(fxt, "coverage");

function defStandup (types) {
  minStandup();

  sh.mkdir(fxtBuild, fxtBundle, fxtCoverage);

  clean(types);
}

describe("clean (api)", function () {
  describe("targets is 'build'", function () {
    before(function () { defStandup("build") });

    expectCleaned(["build"]);

    after(teardown);
  });

  describe("targets is 'bundle'", function () {
    before(function () { defStandup("bundle") });

    expectCleaned(["bundle"]);

    after(teardown);
  });

  describe("targets is 'coverage'", function () {
    before(function () { defStandup("coverage") });

    expectCleaned(["coverage"]);

    after(teardown);
  });

  describe("targets is an array with 'build' and 'bundle'", function () {
    before(function () { defStandup(["build", "bundle"]) });

    expectCleaned(["build", "bundle"]);

    after(teardown);
  });

  describe("targets is undefined", function () {
    before(function () { defStandup() });

    expectCleaned(["build", "bundle", "coverage"]);

    after(teardown);
  });

  describe("targets is an empty array", function () {
    before(function () { defStandup([]) });

    expectCleaned(["build", "bundle", "coverage"]);

    after(teardown);
  });

  describe("targets isn't undefined, a string, or an array", function () {
    it("throw TypeError with descriptive message", function () {
      expect(function () { clean({}) })
        .to.throw(TypeError, "Invalid clean targets");
    });
  });

  describe("a target isn't 'build', 'bundle', or 'coverage'", function () {
    it("throw Error with descriptive message", function () {
      expect(function () { clean("pizza") })
        .to.throw("Invalid clean target: pizza");
    });
  });
});
