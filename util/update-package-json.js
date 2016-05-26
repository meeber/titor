"use strict";

var setupPackageJson = require("./setup-package-json");
var sh = require("shelljs");

module.exports = function updatePackageJson (packageJson) {
  sh.mv("-n", "package.json", "package.json.save");
  sh.echo("Moved existing package.json to package.json.save");

  packageJson = setupPackageJson(packageJson);

  sh.ShellString(JSON.stringify(packageJson, null, 2)).to("package.json");
  sh.echo("Created new package.json");
};
