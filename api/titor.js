var titor = {};

[
  "build",
  "bundle",
  "clean",
  "lint",
  "test",
  "travis",
].forEach(function (key) { titor[key] = require("./" + key) });

module.exports = titor;
