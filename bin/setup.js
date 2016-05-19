#!/usr/bin/env node
"use strict";

var setup = require("../api/setup");
var sh = require("shelljs");

sh.set("-e");

setup();
