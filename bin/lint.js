#!/usr/bin/env node
"use strict";

var configurePath = require("../util/configure-path");
var lint = require("../api/lint");
var sh = require("shelljs");

sh.set("-e");

configurePath();
lint();
