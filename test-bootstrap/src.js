"use strict";

require("./common");
require("babel-core/register");

var detectBuild = require("../lib/detect-build");
var loadConfig = require("../lib/load-config");

// eslint-disable-next-line global-require
if (detectBuild() === "legacy") require("babel-polyfill");

global[loadConfig().export] = require(process.env.PWD + "/src/");
