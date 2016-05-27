"use strict";

var semver = require("semver");

var DEFAULT_MIN_NODE_VER = "v6.0.0";

module.exports = function detectBuild (minNodeVer) {
  if (!minNodeVer) minNodeVer = DEFAULT_MIN_NODE_VER;

  return semver.gte(process.version, minNodeVer) ? "current" : "legacy";
};
