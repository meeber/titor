#!/usr/bin/env node
"use strict";

var release = require("../lib/release");
var sh = require("shelljs");

var version = process.argv.length > 2 ? process.argv[3] : "";

release(version, sh);
