require("./common");
require("babel-core/register");

var util = require("titor-util");

var config = util.loadConfig();

global[config.mainExport] = require(process.env.PWD + "/src/");
