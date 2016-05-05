"use strict";

require("./common");

var loadConfig = require("../util/load-config");

global[loadConfig().export] = require(process.env.PWD + "/build/current");
