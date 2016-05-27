#!/usr/bin/env node
"use strict";

var configurePath = require("../util/configure-path");
var loadConfig = require("../util/load-config");
var sh = require("shelljs");
var titor = require("../api/titor");

sh.set("-e");
configurePath();

var args = process.argv.slice(2);
if (!args.length) throw Error("Missing command");

var cmd = args.shift().toLowerCase();
if (!titor.hasOwnProperty(cmd)) throw Error("Invalid command: " + cmd);

var config = cmd === "setup" ? undefined : loadConfig();

titor[cmd](args, config);
