#!/usr/bin/env node
"use strict";

var configurePath = require("../lib/configure-path");
var loadConfig = require("../lib/load-config");
var sh = require("shelljs");
var travis = require("../lib/travis");

configurePath(sh);

var config = loadConfig();

travis(config, sh);
