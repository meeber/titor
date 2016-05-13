#!/usr/bin/env node
"use strict";

var setup = require("../lib/setup");
var sh = require("shelljs");

sh.set("-e");

setup();
