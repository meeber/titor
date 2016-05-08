#!/usr/bin/env node

"use strict";

var sh = require("shelljs");

sh.set("-e");

var createBabelrc = require("../util/create-babelrc");
var createEslintignore = require("../util/create-eslintignore");
var createEslintrcYml = require("../util/create-eslintrc-yml");
var createSrcIndex = require("../util/create-src-index");
var createTestIndex = require("../util/create-test-index");
var createTitorrcYml = require("../util/create-titorrc-yml");
var createTravisYml = require("../util/create-travis-yml");
var getPackageExport = require("../util/get-package-export");
var loadPackageJson = require("../util/load-package-json");

sh.echo("*** BEGIN SETUP");

var packageJson = loadPackageJson();
var packageExport = getPackageExport(packageJson);

sh.exec("npm install --save semver");

if (createBabelrc()) sh.echo("Created .babelrc");
else sh.echo(".babelrc already exists; skipping");

if (createEslintignore()) sh.echo("Created .eslintignore");
else sh.echo(".eslintignore already exists; skipping");

if (createEslintrcYml()) sh.echo("Created .eslintrc.yml");
else sh.echo(".eslintrc.yml already exists; skipping");

if (createSrcIndex(packageExport)) sh.echo("Created src/index.js");
else sh.echo("src/index.js already exists; skipping");

if (createTestIndex(packageExport)) sh.echo("Created test/index.js");
else sh.echo("test/index.js already exists; skipping");

if (createTitorrcYml(packageExport)) sh.echo("Created .titorrc.yml");
else sh.echo(".titorrc.yml already exists; skipping");

if (createTravisYml()) sh.echo("Created .travis.yml");
else sh.echo(".travis.yml already exists; skipping");

sh.echo("*** END SETUP");
