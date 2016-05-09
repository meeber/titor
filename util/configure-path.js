"use strict";

var path = require("path");

module.exports = function configurePath () {
  var rootNodeModules = path.resolve("node_modules/.bin");

  if (process.env.PATH.indexOf(rootNodeModules) === -1)
    process.env.PATH = rootNodeModules + ":" + process.env.PATH;
};
