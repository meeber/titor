"use strict";

require("./common");
require("babel-core/register");

var decamelize = require("decamelize");
var detectBuild = require("../lib/detect-build");
var loadConfig = require("../lib/load-config");
var path = require("path");

// eslint-disable-next-line global-require
if (detectBuild() === "legacy") require("babel-polyfill");

var config = loadConfig();
var srcPath = path.join(process.env.PWD, "src", decamelize(config.export, "-"));

global[config.export] = require(srcPath);
