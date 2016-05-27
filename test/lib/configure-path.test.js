"use strict";

var configurePath = require("../../lib/configure-path");
var path = require("path");
var sh = require("shelljs");

var fxtNodeModulesBin = path.resolve(fxt, "node_modules/.bin");
var fxtSubDir = path.join(fxt, "sub-dir");

describe("configurePath", function () {
  describe("package's node_modules/.bin isn't in path", function () {
    var origPath;

    before(function () {
      minStandup();

      origPath = process.env.PATH;

      configurePath();
    });

    it("add package's node_modules/.bin to path", function () {
      expect(process.env.PATH).to.match(new RegExp(fxtNodeModulesBin));
    });

    after(function () {
      teardown();

      process.env.PATH = origPath;
    });
  });

  describe("run script while in a subdirectory", function () {
    var origPath;

    before(function () {
      minStandup();

      origPath = process.env.PATH;

      sh.mkdir(fxtSubDir);
      sh.cd(fxtSubDir);

      configurePath();
    });

    it("add package's node_modules/.bin to path", function () {
      expect(process.env.PATH).to.match(new RegExp(fxtNodeModulesBin));
    });

    after(function () {
      teardown();

      process.env.PATH = origPath;
    });
  });

  describe("package's node_modules/.bin is already in path", function () {
    var configuredPath, origPath;

    before(function () {
      minStandup();

      origPath = process.env.PATH;

      configurePath();
      configuredPath = process.env.PATH;
      configurePath();
    });

    it("don't modify path", function () {
      expect(process.env.PATH).to.equal(configuredPath);
    });

    after(function () {
      teardown();

      process.env.PATH = origPath;
    });
  });
});
