#!/usr/bin/env node

"use strict";

var sh = require("shelljs");

sh.set("-e");

sh.echo("*** BEGIN LINT");

sh.exec("eslint --color --fix .");

sh.echo("*** END LINT");
