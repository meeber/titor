"use strict";

require("./common");

var loadConfig = require("../lib/load-config");

global[loadConfig().export] = require(process.env.PWD + "/build/current");
