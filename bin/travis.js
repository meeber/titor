#!/usr/bin/env node
"use strict";

var configurePath = require("../lib/configure-path");
var loadConfig = require("../lib/load-config");
var sh = require("shelljs");
var travis = require("../lib/travis");

sh.set("-e");

configurePath();

travis(loadConfig());
