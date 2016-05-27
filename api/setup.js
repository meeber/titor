"use strict";

var createResources = require("../lib/create-resources");
var loadPackageJson = require("../lib/load-package-json");
var updatePackageJson = require("../lib/update-package-json");
var sh = require("shelljs");

module.exports = function setup () {
  sh.echo("*** BEGIN SETUP");

  var packageJson = loadPackageJson();

  updatePackageJson(packageJson);
  createResources(packageJson);

  sh.echo("*** END SETUP");
  sh.echo("\nTo install peer dependencies, run: npm install");
};
