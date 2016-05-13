#!/usr/bin/env node
"use strict";

var configurePath = require("../lib/configure-path");
var lint = require("../lib/lint");
var sh = require("shelljs");

sh.set("-e");

configurePath();
lint();
