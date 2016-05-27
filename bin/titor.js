#!/usr/bin/env node
"use strict";

var configurePath = require("../lib/configure-path");
var loadConfig = require("../lib/load-config");
var sh = require("shelljs");
var titor = require("../api/titor");

sh.set("-e");
configurePath();

var args = process.argv.slice(2);
if (!args.length) throw Error("Missing command");

var cmd = args.shift().toLowerCase();
if (!Object.prototype.hasOwnProperty.call(titor, cmd))
  throw Error("Invalid command: " + cmd);

var config = cmd === "setup" ? undefined : loadConfig();

titor[cmd](args, config);
