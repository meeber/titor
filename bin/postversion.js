#!/usr/bin/env node
"use strict";

var postversion = require("../lib/postversion");
var sh = require("shelljs");

postversion(sh);
