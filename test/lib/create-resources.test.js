"use strict";

var createResources = require("../../lib/create-resources");
var expectResourcesCreated =
  require("../fixture/expect/expect-resources-created");
var getMinPkgJsonObj = require("../fixture/helper/get-min-pkg-json-obj");
var path = require("path");
var sh = require("shelljs");

var fxtTitorrcYml = path.join(fxt, ".titorrc.yml");

describe("createResources", function () {
  describe("resource files don't already exist", function () {
    before(function () {
      minStandup();

      createResources(getMinPkgJsonObj());
    });

    expectResourcesCreated();

    after(teardown);
  });

  describe(".titorrc.yml already exists", function () {
    before(function () {
      minStandup();

      sh.ShellString("pizza").to(fxtTitorrcYml);

      createResources(getMinPkgJsonObj());
    });

    expectResourcesCreated(".titorrc.yml");

    after(teardown);
  });
});
