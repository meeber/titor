#!/usr/bin/env node

"use strict";

var sh = require("shelljs");

sh.set("-e");

var copyBabelrc = require("../util/copy-babelrc");
var copyTitorrc = require("../util/copy-titorrc");

sh.echo("*** BEGIN SETUP");

if (copyBabelrc()) sh.echo("Copied .babelrc");
else sh.echo(".babelrc already exists; skipping");

if (copyTitorrc()) sh.echo("Copied .titorrc");
else sh.echo(".titorrc already exists; skipping");

sh.echo("*** END SETUP");
