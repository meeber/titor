"use strict";

var loadConfig = require("../../util/load-config");
var path = require("path");
var sh = require("shelljs");

var tmpTitorrcYml = path.join(tmpRoot, ".titorrc.yml");

describe("loadConfig", function () {
  afterEach(function () { teardown() });
  beforeEach(function () { standup() });

  describe(".titorrc.yml is valid", function () {
    it("return a config object", function () {
      expect(loadConfig()).to.deep.equal({
        bundle: true,
        cover: true,
        coverReport: true,
        export: "testPackage",
        lint: true,
        test: true,
      });
    });
  });

  describe(".titorrc.yml is invalid", function () {
    it("throw", function () {
      sh.cp(
        path.join(__dirname, "../fixture/double/bad-format.titorrc.yml"),
        tmpTitorrcYml
      );

      expect(loadConfig).to.throw("Invalid .titorrc.yml");
    });
  });

  describe("config.export is invalid", function () {
    it("throw", function () {
      sh.cp(
        path.join(__dirname, "../fixture/double/bad-export.titorrc.yml"),
        tmpTitorrcYml
      );

      expect(loadConfig).to.throw(/Invalid or missing export/);
    });
  });

  describe(".titorrc.yml doesn't exist", function () {
    it("throw", function () {
      sh.rm(tmpTitorrcYml);

      expect(loadConfig).to.throw(/no such file/);
    });
  });
});
