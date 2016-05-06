#!/usr/bin/env node

"use strict";

var sh = require("shelljs");

sh.set("-e");

var copyBabelrc = require("../util/copy-babelrc");

sh.echo("*** BEGIN SETUP");

if (copyBabelrc()) sh.echo("Copied .babelrc");
else sh.echo("Skipped copying .babelrc");

sh.echo("*** END SETUP");
