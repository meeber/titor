"use strict";

require("./common");
require("babel-core/register");

var detectBuild = require("../util/detect-build");
var loadConfig = require("../util/load-config");

// eslint-disable-next-line global-require
if (detectBuild() === "legacy") require("babel-polyfill");

global[loadConfig().export] = require(process.env.PWD + "/src/");
