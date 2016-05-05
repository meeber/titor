"use strict";

var detectBuild = require("./detect-build");

module.exports = require("./" + detectBuild());
