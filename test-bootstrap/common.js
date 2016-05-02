require("source-map-support/register");

if (typeof window === "object") {
  // eslint-disable-next-line no-native-reassign
  global = window;
  mocha.setup("bdd");
}

global.chai = require("chai");

global.expect = global.chai.expect;
