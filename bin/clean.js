#!/usr/bin/env node
"use strict";

var clean = require("../lib/clean");
var sh = require("shelljs");

sh.set("-e");

var targets = process.argv.length > 2 ? process.argv.slice(2)
            : ["build", "bundle", "coverage"];

clean(targets);
