"use strict";

var loadConfig = require("../../util/load-config");
var path = require("path");
var sh = require("shelljs");

describe("loadConfig", function () {
  var badExportTitorrcYml = path.join(
    __dirname,
    "../fixture/resource/bad-export_.titorrc.yml"
  );
  var badFormatTitorrcYml = path.join(
    __dirname,
    "../fixture/resource/bad-format_.titorrc.yml"
  );
  var rootTitorrcYml = path.join(tmpRoot, ".titorrc.yml");

  afterEach(teardown);
  beforeEach(standup);

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
      sh.cp(badFormatTitorrcYml, rootTitorrcYml);

      expect(loadConfig).to.throw("Invalid .titorrc.yml");
    });
  });

  describe("config.export is invalid", function () {
    it("throw", function () {
      sh.cp(badExportTitorrcYml, rootTitorrcYml);

      expect(loadConfig).to.throw(/Invalid or missing export/);
    });
  });

  describe(".titorrc.yml doesn't exist", function () {
    it("throw", function () {
      sh.rm(rootTitorrcYml);

      expect(loadConfig).to.throw(/no such file/);
    });
  });
});
