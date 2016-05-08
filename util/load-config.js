"use strict";

var sh = require("shelljs");

sh.set("-e");

var yaml = require("js-yaml");

module.exports = function loadConfig () {
  var config = yaml.safeLoad(sh.cat(".titorrc.yml"));

  if (typeof config !== "object") throw Error("Invalid .titorrc.yml");

  if (typeof config.export !== "string")
    throw Error("Invalid or missing export in .titorrc.yml");

  return config;
};
