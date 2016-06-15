"use strict";

const {join} = require("path");
const {cd, cp, ln, rm, tempdir, test} = require("../lib/sh");

let origDir;

const rootDir = join(tempdir(), "titor-fixture-root");

function standup () {
  if (test("-e", rootDir)) rm("-rf", rootDir);

  cp("-r", join(__dirname, "../../asset/fixture/_root"), rootDir);
  ln(
    "-s",
    join(__dirname, "../../node_modules"),
    join(rootDir, "node_modules"),
  );

  origDir = process.env.PWD;
  cd(rootDir);
}

function teardown () {
  cd(origDir);
  rm("-rf", rootDir);
}

module.exports = {rootDir, standup, teardown};
