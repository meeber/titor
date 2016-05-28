"use strict";

var createLintableJs = require("../fixture/helper/create-lintable-js");
var createTestJs = require("../fixture/helper/create-test-js");
var expectLintableFixed = require("../fixture/expect/expect-lintable-fixed");
var expectLintableNotFixed =
  require("../fixture/expect/expect-lintable-not-fixed");
var sh = require("shelljs");
var testSrc = require("../../lib/test-src");

describe("testSrc", function () {
  describe("isLint is false", function () {
    var result;

    before(function () {
      maxStandup();

      createTestJs("src");
      createLintableJs("src");

      result = testSrc(false, "current");
    });

    it("run mocha on src", function () {
      expect(result.stdout).to.match(/pizza[\s\S]+magical[\s\S]+1 passing/);
    });

    expectLintableNotFixed("src");

    after(teardown);
  });

  describe("isLint is true", function () {
    var result;

    before(function () {
      maxStandup();

      createTestJs("src");
      createLintableJs("src");

      result = testSrc(true, "current");
    });

    it("run mocha on src", function () {
      expect(result.stdout).to.match(/pizza[\s\S]+magical[\s\S]+1 passing/);
    });

    expectLintableFixed("src");

    after(teardown);
  });

  describe("detectedBuild is 'current'", function () {
    var origShExec;

    before(function () {
      origShExec = sh.exec;
      sh.exec = sinon.spy();

      testSrc(false, "current");
    });

    it("run mocha without babel-polyfill", function () {
      expect(sh.exec).to.not.have.been.calledWithMatch(/-r babel-polyfill/);
    });

    after(function () {
      sh.exec = origShExec;
    });
  });

  describe("detectedBuild is 'legacy'", function () {
    var origShExec;

    before(function () {
      origShExec = sh.exec;
      sh.exec = sinon.spy();

      testSrc(false, "legacy");
    });

    it("run mocha with babel-polyfill", function () {
      expect(sh.exec).to.have.been.calledWithMatch(/-r babel-polyfill/);
    });

    after(function () {
      sh.exec = origShExec;
    });
  });

  describe("test fails", function () {
    var result;

    before(function () {
      maxStandup();

      sh.set("+e");
      createTestJs("src", true);

      result = testSrc(false, "current");
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
