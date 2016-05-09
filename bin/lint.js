#!/usr/bin/env node

"use strict";

var sh = require("shelljs");

sh.set("-e");

var configurePath = require("../util/configure-path");

configurePath();

sh.echo("*** BEGIN LINT");

sh.exec("eslint --color --fix .");

sh.echo("*** END LINT");
