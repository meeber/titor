#!/usr/bin/env node

"use strict";

var sh = require("shelljs");

sh.set("-e");

var createBabelrc = require("../util/create-babelrc");
var createSrcIndex = require("../util/create-src-index");
var createTestIndex = require("../util/create-test-index");
var createTitorrc = require("../util/create-titorrc");
var getPackageExport = require("../util/get-package-export");
var loadPackageJson = require("../util/load-package-json");

sh.echo("*** BEGIN SETUP");

var packageJson = loadPackageJson();
var packageExport = getPackageExport(packageJson);

sh.exec("npm install --save semver");

if (createBabelrc()) sh.echo("Created .babelrc");
else sh.echo(".babelrc already exists; skipping");

if (createSrcIndex(packageExport)) sh.echo("Created src/index.js");
else sh.echo("src/index.js already exists; skipping");

if (createTestIndex(packageExport)) sh.echo("Created test/index.js");
else sh.echo("test/index.js already exists; skipping");

if (createTitorrc(packageExport)) sh.echo("Created .titorrc");
else sh.echo(".titorrc already exists; skipping");

sh.echo("*** END SETUP");
