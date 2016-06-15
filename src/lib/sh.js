"use strict";

const sh = require("shelljs");

sh.config.fatal = true;

sh.execAsync = function execAsync (cmd) {
  return new Promise((resolve, reject) => {
    sh.exec(cmd, (code, stdout, stderr) => {
      const details = {cmd, code, stdout, stderr};

      if (code) reject(Object.assign(Error(`${stderr || stdout}`), details));
      else resolve(details);
    });
  });
};

module.exports = sh;
