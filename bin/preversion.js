#!/usr/bin/env node

"use strict";

var sh = require("shelljs");

sh.set("-e");

sh.echo("*** BEGIN PREVERSION");

sh.exec("git checkout master");
sh.exec("git merge dev");
sh.exec("npm run build");
sh.exec("git add -A");

sh.echo("*** END PREVERSION");