#!/usr/bin/env node
"use strict";

const {lint} = require("../api");
const linterEslint = require("../lib/linter-eslint");

async function main () {
  await lint(linterEslint);
}

main();
