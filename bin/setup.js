#!/usr/bin/env node

"use strict";

var sh = require("shelljs");

sh.set("-e");

var copyBabelrc = require("../util/copy-babelrc");
var copySrcIndex = require("../util/copy-src-index");
var copyTitorrc = require("../util/copy-titorrc");

sh.echo("*** BEGIN SETUP");

if (copyTitorrc()) sh.echo("Copied .titorrc");
else sh.echo(".titorrc already exists; skipping");

if (copyBabelrc()) sh.echo("Copied .babelrc");
else sh.echo(".babelrc already exists; skipping");

if (copySrcIndex()) sh.echo("Copied src/index.js");
else sh.echo("src/index.js already exists; skipping");

sh.echo("*** END SETUP");
