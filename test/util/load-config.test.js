"use strict";

var loadConfig = require("../../util/load-config");
var path = require("path");
var sh = require("shelljs");

var badExportTitorrcYml = path.join(
  __dirname,
  "../fixture/resource/bad-export_.titorrc.yml"
);
var badFormatTitorrcYml = path.join(
  __dirname,
  "../fixture/resource/bad-format_.titorrc.yml"
);
var fxtTitorrcYml = path.join(fxt, ".titorrc.yml");

describe("loadConfig", function () {
  describe(".titorrc.yml is valid", function () {
    var config;

    before(function () {
      standup();

      config = loadConfig();
    });

    it("return a config object", function () {
      expect(config).to.deep.equal({
        bundle: true,
        cover: true,
        coverReport: true,
        export: "testPackage",
        lint: true,
        test: true,
      });
    });

    afterEach(teardown);
  });

  describe(".titorrc.yml is invalid", function () {
    before(function () {
      standup();

      sh.cp(badFormatTitorrcYml, fxtTitorrcYml);
    });

    it("throw Error with descriptive message", function () {
      expect(loadConfig).to.throw(Error, "Invalid .titorrc.yml");
    });

    afterEach(teardown);
  });

  describe("config.export is invalid", function () {
    before(function () {
      standup();

      sh.cp(badExportTitorrcYml, fxtTitorrcYml);
    });

    it("throw Error with descriptive message", function () {
      expect(loadConfig)
        .to.throw(Error, "Invalid or missing export in .titorrc.yml");
    });

    afterEach(teardown);
  });

  describe(".titorrc.yml doesn't exist", function () {
    before(function () {
      standup();

      sh.rm(fxtTitorrcYml);
    });

    it("throw Error with descriptive message", function () {
      expect(loadConfig)
        .to.throw(Error, "cat: no such file or directory: .titorrc.yml");
    });

    afterEach(teardown);
  });
});
