#!/usr/bin/env node
"use strict";

var preversion = require("preversion");
var sh = require("shelljs");

preversion(sh);
