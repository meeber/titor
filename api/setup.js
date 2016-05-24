"use strict";

var createResource = require("../util/create-resource");
var decamelize = require("decamelize");
var getPackageExport = require("../util/get-package-export");
var loadPackageJson = require("../util/load-package-json");
var path = require("path");
var setupPackageJson = require("../util/setup-package-json");
var sh = require("shelljs");

function createResources (packageJson) {
  var pkgExport = getPackageExport(packageJson);

  [
    {dst: ".babelrc"},
    {dst: ".eslintignore"},
    {dst: ".eslintrc.yml"},
    {dst: ".gitignore"},
    {dst: "test/.eslintrc.yml", export: pkgExport},
    {dst: "test/fixture/common.js"},
    {dst: "test/fixture/current.js", export: pkgExport},
    {dst: "test/fixture/legacy.js", export: pkgExport},
    {dst: "test/fixture/src.js", export: pkgExport},
    {dst: ".titorrc.yml", export: pkgExport},
    {dst: ".travis.yml"},
    {
      dst: path.join("src", decamelize(pkgExport, "-") + ".js"),
      export: pkgExport,
      src: path.join(__dirname, "../resource/src/_package-export.js"),
    },
    {
      dst: path.join("test", decamelize(pkgExport, "-") + ".test.js"),
      export: pkgExport,
      src: path.join(__dirname, "../resource/test/_package-export.test.js"),
    },
  ].forEach(function _createResource (res) {
    if (createResource(res.dst, res.export, res.src))
      sh.echo("Created " + res.dst);
    else
      sh.echo(res.dst + " already exists; skipping");
  });
}

function updatePackageJson (packageJson) {
  sh.mv("-n", "package.json", "package.json.save");
  sh.echo("Moved existing package.json to package.json.save");

  packageJson = setupPackageJson(packageJson);

  sh.ShellString(JSON.stringify(packageJson, null, 2)).to("package.json");
  sh.echo("Created new package.json");
}

module.exports = function setup () {
  sh.echo("*** BEGIN SETUP");

  var packageJson = loadPackageJson();

  updatePackageJson(packageJson);
  createResources(packageJson);

  sh.echo("*** END SETUP");
  sh.echo("\nTo install peer dependencies, run: npm install");
};
