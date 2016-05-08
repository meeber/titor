"use strict";

require("source-map-support/register");

if (typeof window === "object") {
  window.global = window;
  mocha.setup("bdd");
}

global.chai = require("chai");
