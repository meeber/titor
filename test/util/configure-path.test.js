"use strict";

var configurePath = require("../../util/configure-path");
var path = require("path");
var sh = require("shelljs");

describe("configurePath", function () {
  var origPath = process.env.PATH;
  var rootNodeModules = path.resolve(tmpRoot, "node_modules/.bin");

  afterEach(function () {
    teardown();
    process.env.PATH = origPath;
  });

  beforeEach(function () { standup() });

  describe("package's node_modules/.bin isn't in path", function () {
    it("add package's node_modules/.bin to path", function () {
      configurePath();

      expect(process.env.PATH).to.match(new RegExp(rootNodeModules));
    });
  });

  describe("run script while in a subdirectory", function () {
    it("add package's node_modules/.bin to path", function () {
      var tmpSubdir = path.join(tmpRoot, "subdir");

      sh.mkdir(tmpSubdir);
      sh.cd(tmpSubdir);
      configurePath();

      expect(process.env.PATH).to.match(new RegExp(rootNodeModules));
    });
  });

  describe("package's node_modules/.bin is already in path", function () {
    it("don't modify path", function () {
      configurePath();
      var configuredPath = process.env.PATH;
      configurePath();

      expect(process.env.PATH).to.equal(configuredPath);
    });
  });
});
