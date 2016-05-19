#!/usr/bin/env node
"use strict";

var bundle = require("../api/bundle");
var configurePath = require("../util/configure-path");
var loadConfig = require("../util/load-config");
var sh = require("shelljs");

sh.set("-e");

configurePath();

var types = process.argv.length > 2 ? process.argv.slice(2)
          : ["current", "legacy"];

bundle(types, loadConfig());
