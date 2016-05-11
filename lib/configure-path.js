"use strict";

module.exports = function configurePath (sh) {
  var rootNodeModules = sh
    .exec("npm bin", {silent: true})
    .stdout
    .replace("\n", "");

  if (process.env.PATH.indexOf(rootNodeModules) === -1)
    process.env.PATH = rootNodeModules + ":" + process.env.PATH;
};
