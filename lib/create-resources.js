"use strict";

var createResource = require("./create-resource");
var decamelize = require("decamelize");
var getPackageExport = require("./get-package-export");
var path = require("path");
var sh = require("shelljs");

module.exports = function createResources (packageJson) {
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
};
