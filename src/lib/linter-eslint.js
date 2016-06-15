"use strict";

const {execAsync} = require("./sh");

function lint () {
  return execAsync("eslint --fix .");
}

module.exports = {lint};
