"use strict";

var createTest = require("../fixture/helper/create-test-js");
var sh = require("shelljs");
var testBuild = require("../../lib/test-build");

describe("testBuild", function () {
  describe("type is 'current'", function () {
    var result;

    before(function () {
      maxStandup();

      createTest("current");

      result = testBuild("current");
    });

    it("run mocha on the current build", function () {
      expect(result.stdout).to.match(/pizza[\s\S]+magical[\s\S]+1 passing/);
    });

    after(teardown);
  });

  describe("type is 'legacy'", function () {
    var result;

    before(function () {
      maxStandup();

      createTest("legacy");

      result = testBuild("legacy");
    });

    it("run mocha on the legacy build", function () {
      expect(result.stdout).to.match(/pizza[\s\S]+magical[\s\S]+1 passing/);
    });

    after(teardown);
  });

  describe("test fails", function () {
    var result;

    before(function () {
      maxStandup();

      sh.set("+e");
      createTest("current", true);

      result = testBuild("current");
    });

    it("terminate with exit code 1", function () {
      expect(result).to.have.property("code", 1);
    });

    it("output descriptive message to stdout", function () {
      expect(result.stdout).to.match(/mayo[\s\S]+tragic[\s\S]+1 failing/);
    });

    after(function () {
      teardown();

      sh.set("-e");
    });
  });
});
