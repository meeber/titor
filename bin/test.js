#!/usr/bin/env node
"use strict";

var configurePath = require("../util/configure-path");
var loadConfig = require("../util/load-config");
var sh = require("shelljs");
var test = require("../api/test");

sh.set("-e");

configurePath();

var types = process.argv.length > 2 ? process.argv.slice(2) : ["src"];

test(types, loadConfig());
