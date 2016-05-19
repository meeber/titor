#!/usr/bin/env node
"use strict";

var configurePath = require("../util/configure-path");
var loadConfig = require("../util/load-config");
var sh = require("shelljs");
var travis = require("../api/travis");

sh.set("-e");

configurePath();

travis(loadConfig());
