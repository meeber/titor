"use strict";

var camelCase = require("camelcase");

module.exports = function getPackageExport (packageJson) {
  if (typeof packageJson !== "object")
    throw Error("Missing or invalid packageJson");
  if (typeof packageJson.name !== "string")
    throw Error("Missing or invalid name");

  return camelCase(packageJson.name);
};
