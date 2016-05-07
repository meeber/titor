#!/usr/bin/env node

"use strict";

var sh = require("shelljs");

sh.set("-e");

var createBabelrc = require("../util/create-babelrc");
var createSrcIndex = require("../util/create-src-index");
var createTitorrc = require("../util/create-titorrc");

sh.echo("*** BEGIN SETUP");

if (createTitorrc()) sh.echo("Created .titorrc");
else sh.echo(".titorrc already exists; skipping");

if (createBabelrc()) sh.echo("Created .babelrc");
else sh.echo(".babelrc already exists; skipping");

if (createSrcIndex()) sh.echo("Created src/index.js");
else sh.echo("src/index.js already exists; skipping");

sh.echo("*** END SETUP");
