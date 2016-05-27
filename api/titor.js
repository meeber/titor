/* eslint-disable global-require */
"use strict";

var titor = {};

[
  "build",
  "bundle",
  "clean",
  "lint",
  "setup",
  "test",
  "travis",
].forEach(function _addApiKey (key) { titor[key] = require("./" + key) });

module.exports = titor;
