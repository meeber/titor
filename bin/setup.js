#!/usr/bin/env node

"use strict";

var sh = require("shelljs");

sh.set("-e");

var createResource = require("../lib/create-resource");
var getPackageExport = require("../lib/get-package-export");
var loadPackageJson = require("../lib/load-package-json");
var path = require("path");

sh.echo("*** BEGIN SETUP");

var packageJson = loadPackageJson();

sh.mv("-n", "package.json", "package.json.save");
sh.echo("Moved existing package.json to package.json.save");

packageJson.main = "build/";

var scripts = {
  build: "titor-build",
  bundle: "titor-bundle",
  clean: "titor-clean",
  lint: "titor-lint",
  postversion: "titor-postversion",
  preversion: "titor-preversion",
  release: "titor-release",
  test: "titor-test",
  travis: "titor-travis",
};

var key;

if (!packageJson.dependencies) packageJson.dependencies = {};
if (!packageJson.devDependencies) packageJson.devDependencies = {};
if (!packageJson.scripts) packageJson.scripts = {};

for (key in scripts)
  if (scripts.hasOwnProperty(key)) packageJson.scripts[key] = scripts[key];

var titorPackageJson = loadPackageJson(path.join(__dirname, ".."));

for (key in titorPackageJson.peerDependencies) {
  if (key === "semver")
    packageJson.dependencies[key] = titorPackageJson.peerDependencies[key];
  else if (titorPackageJson.peerDependencies.hasOwnProperty(key))
    packageJson.devDependencies[key] = titorPackageJson.peerDependencies[key];
}

if (packageJson.devDependencies.semver)
  packageJson.devDependencies.semver = undefined;

sh.ShellString(JSON.stringify(packageJson, null, 2)).to("package.json");
sh.echo("Created new package.json");

var packageExport = getPackageExport(packageJson);

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
sh.echo("\nTo complete setup, run: npm install");
