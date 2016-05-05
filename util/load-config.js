"use strict";

var fs = require("fs");
var yaml = require("js-yaml");

module.exports = function loadConfig () {
  var config = yaml.safeLoad(fs.readFileSync(".titorrc", "utf8"));

  if (typeof config !== "object") throw Error("Invalid .titorrc");

  if (typeof config.export !== "string")
    throw Error("Invalid or missing export in .titorrc");

  return config;
};
