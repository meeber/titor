"use strict";

require("./common");

var util = require("titor-util");

var config = util.loadConfig();

global[config.mainExport] = require(process.env.PWD + "/build/legacy");
