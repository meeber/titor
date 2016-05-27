"use strict";

var expectPkgJsonNotUpdated =
  require("../fixture/expect/expect-pkg-json-not-updated");
var expectPkgJsonUpdated = require("../fixture/expect/expect-pkg-json-updated");
var expectResourcesCreated =
  require("../fixture/expect/expect-resources-created");
var path = require("path");
var sh = require("shelljs");
var titor = require("../../api/titor");

var fxtTitorrcYml = path.join(fxt, ".titorrc.yml");
var fxtPackageJsonSave = path.join(fxt, "package.json.save");

describe("setup (api)", function () {
  describe("project root is fresh", function () {
    before(function () {
      minStandup();

      titor.setup();
    });

    expectPkgJsonUpdated();
    expectResourcesCreated();

    after(teardown);
  });

  describe("package.json.save already exists", function () {
    before(function () {
      minStandup();

      sh.ShellString("pizza").to(fxtPackageJsonSave);
    });

    it("throw Error with descriptive message", function () {
      expect(titor.setup)
        .to.throw("mv: dest file already exists: package.json.save");
    });

    expectPkgJsonNotUpdated();

    it("don't create .titorrc.yml", function () {
      expect(sh.test("-e", fxtTitorrcYml)).to.be.false;
    });

    after(teardown);
  });

  describe(".titorrc.yml already exists", function () {
    before(function () {
      minStandup();

      sh.ShellString("pizza").to(fxtTitorrcYml);

      titor.setup();
    });

    expectPkgJsonUpdated();
    expectResourcesCreated(".titorrc.yml");

    after(teardown);
  });
});
