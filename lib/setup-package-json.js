"use strict";

var clone = require("./clone");
var loadPackageJson = require("./load-package-json");
var path = require("path");

var SCRIPTS = {
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

module.exports = function setupPackageJson (curPj, sh) {
  var newPj = clone(curPj);

  newPj.main = "build/";

  if (!newPj.dependencies) newPj.dependencies = {};
  if (!newPj.devDependencies) newPj.devDependencies = {};
  if (!newPj.scripts) newPj.scripts = {};

  Object.keys(SCRIPTS).forEach(function setScript (key) {
    newPj.scripts[key] = SCRIPTS[key];
  });

  var titorPj = loadPackageJson(path.join(__dirname, ".."), sh);

  Object.keys(titorPj.peerDependencies).forEach(
    function setDependencies (key) {
      // semver is a dependency instead of a peer dependency because it's
      // required by the auto-version-detection entry point that Titor adds
      if (key === "semver")
        newPj.dependencies[key] = titorPj.peerDependencies[key];
      else
        newPj.devDependencies[key] = titorPj.peerDependencies[key];
    }
  );

  if (newPj.devDependencies.semver)
    delete newPj.devDependencies.semver;

  return newPj;
};
