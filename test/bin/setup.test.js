"use strict";

var expectPkgJsonNotUpdated =
  require("../fixture/expect/expect-pkg-json-not-updated");
var expectPkgJsonUpdated = require("../fixture/expect/expect-pkg-json-updated");
var expectResourcesCreated =
  require("../fixture/expect/expect-resources-created");
var path = require("path");
var sh = require("shelljs");

var binTitorJs = path.join(__dirname, "../../bin/titor.js");
var fxtTitorrcYml = path.join(fxt, ".titorrc.yml");
var fxtPackageJsonSave = path.join(fxt, "package.json.save");

describe("setup (bin)", function () {
  describe("project root is fresh", function () {
    before(function () {
      minStandup();

      sh.exec(binTitorJs + " setup");
    });

    expectPkgJsonUpdated();
    expectResourcesCreated();

    after(teardown);
  });

  describe("package.json.save already exists", function () {
    var result;

    before(function () {
      minStandup();

      sh.ShellString("pizza").to(fxtPackageJsonSave);

      sh.set("+e");

      result = sh.exec(binTitorJs + " setup");
    });

    it("terminate with exit code 1", function () {
      expect(result).to.have.property("code", 1);
    });

    it("output descriptive message to stderr", function () {
      expect(result.stderr)
        .to.match(/mv: dest file already exists: package.json.save/);
    });

    expectPkgJsonNotUpdated();

    it("don't create .titorrc.yml", function () {
      expect(sh.test("-e", fxtTitorrcYml)).to.be.false;
    });

    after(function () {
      teardown();

      sh.set("-e");
    });
  });

  describe(".titorrc.yml already exists", function () {
    before(function () {
      minStandup();

      sh.ShellString("pizza").to(fxtTitorrcYml);

      sh.exec(binTitorJs + " setup");
    });

    expectPkgJsonUpdated();
    expectResourcesCreated(".titorrc.yml");

    after(teardown);
  });
});
