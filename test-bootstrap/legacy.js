"use strict";

require("./common");
require("babel-polyfill");

var loadConfig = require("../util/load-config");

global[loadConfig().export] = require(process.env.PWD + "/build/legacy");
