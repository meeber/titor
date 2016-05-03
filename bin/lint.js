#!/usr/bin/env node

"use strict";

var sh = require("shelljs");

sh.set("-e");

sh.echo("*** BEGIN LINT");

var version = process.argv.length > 2 ? process.argv[3] : "";
sh.echo("WAT " + version);
sh.exec("eslint --color --fix .");

sh.echo("*** END LINT");
