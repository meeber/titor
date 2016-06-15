"use strict";

const {execAsync} = require("./sh");

function transpileBuild (compatLevel) {
  return execAsync(`BABEL_ENV=${compatLevel}`
                 + ` babel -s`
                 + ` -d ${compatLevel}-build/`
                 + ` src/`);
}

function transpile () {
  return Promise.all([
    transpileBuild("current"),
    transpileBuild("legacy"),
  ]);
}

module.exports = {transpile};
