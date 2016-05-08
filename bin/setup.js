#!/usr/bin/env node

"use strict";

var sh = require("shelljs");

sh.set("-e");

var createResource = require("../util/create-resource");
var getPackageExport = require("../util/get-package-export");
var loadPackageJson = require("../util/load-package-json");

sh.echo("*** BEGIN SETUP");

var packageJson = loadPackageJson();
var packageExport = getPackageExport(packageJson);

sh.echo("Working...");
sh.exec("npm install --save semver");
sh.echo("Installed semver and saved as dependency in package.json");

[
  [".babelrc"],
  [".eslintignore"],
  [".eslintrc.yml"],
  [".gitignore"],
  [".titorrc.yml", packageExport],
  [".travis.yml"],
  ["src/index.js", packageExport],
  ["test/.eslintrc.yml"],
  ["test/index.js", packageExport],
].forEach(function _createResource (args) {
  if (createResource.apply(undefined, args)) sh.echo("Created " + args[0]);
  else sh.echo(args[0] + " already exists; skipping");
});

sh.echo("*** END SETUP");
