#!/usr/bin/env node
"use strict";

var configurePath = require("../util/configure-path");
var loadConfig = require("../util/load-config");
var path = require("path");
var sh = require("shelljs");

sh.set("-e");
configurePath();

var VALID_CMDS = [
  "build",
  "bundle",
  "clean",
  "lint",
  "setup",
  "test",
  "travis",
];

var args = process.argv.slice(2);
if (!args.length) throw Error("Missing command");

var cmd = args.shift().toLowerCase();
if (VALID_CMDS.indexOf(cmd) === -1) throw Error("Invalid command: " + cmd);

require(path.join("../api", cmd))(args, loadConfig());
