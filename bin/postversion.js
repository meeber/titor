#!/usr/bin/env node
"use strict";

var postversion = require("../lib/postversion");
var sh = require("shelljs");

sh.set("-e");

postversion();
