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

  it("should add package's node_modules/.bin to path", function () {
    configurePath();

    expect(process.env.PATH).to.match(new RegExp(rootNodeModules));
  });

  it("should work even if in subdirectory", function () {
    var tmpSubdir = path.join(tmpRoot, "subdir");

    sh.mkdir(tmpSubdir);
    sh.cd(tmpSubdir);

    configurePath();

    expect(process.env.PATH).to.match(new RegExp(rootNodeModules));
  });

  it("shouldn't modify path if already configured", function () {
    configurePath();
    var configuredPath = process.env.PATH;
    configurePath();

    expect(process.env.PATH).to.equal(configuredPath);
  });
});
