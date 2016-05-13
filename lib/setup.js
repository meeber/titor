"use strict";

var createResource = require("./create-resource");
var getPackageExport = require("./get-package-export");
var loadPackageJson = require("./load-package-json");
var setupPackageJson = require("./setup-package-json");

var RESOURCES = [
  {file: ".babelrc"},
  {file: ".eslintignore"},
  {file: ".eslintrc.yml"},
  {file: ".gitignore"},
  {file: ".titorrc.yml", passPackageExport: true},
  {file: ".travis.yml"},
  {file: "src/index.js", passPackageExport: true},
  {file: "test/.eslintrc.yml"},
  {file: "test/index.js", passPackageExport: true},
];

function createResources (packageJson, sh) {
  var packageExport = getPackageExport(packageJson);

  RESOURCES.forEach(function _createResource (res) {
    var arg2 = res.passPackageExport ? packageExport : undefined;

    if (createResource(res.file, arg2)) sh.echo("Created " + res.file);
    else sh.echo(res.file + " already exists; skipping");
  });
}

function updatePackageJson (packageJson, sh) {
  sh.mv("-n", "package.json", "package.json.save");
  sh.echo("Moved existing package.json to package.json.save");

  packageJson = setupPackageJson(packageJson, sh);

  sh.ShellString(JSON.stringify(packageJson, null, 2)).to("package.json");
  sh.echo("Created new package.json");
}

module.exports = function setup (sh) {
  sh.set("-e");
  sh.echo("*** BEGIN SETUP");

  var packageJson = loadPackageJson(sh);

  updatePackageJson(packageJson, sh);
  createResources(packageJson, sh);

  sh.echo("*** END SETUP");
  sh.echo("\nTo install peer dependencies, run: npm install");
  sh.set("+e");
};