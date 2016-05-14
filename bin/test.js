#!/usr/bin/env node
"use strict";

var configurePath = require("../lib/configure-path");
var loadConfig = require("../lib/load-config");
var sh = require("shelljs");
var test = require("../lib/test");

sh.set("-e");

configurePath();

var types = process.argv.length > 2 ? process.argv.slice(2) : ["src"];

test(types, loadConfig());
