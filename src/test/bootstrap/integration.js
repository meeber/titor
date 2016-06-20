"use strict";

require("./common");

describe("integration", () => {
  require("require-dir")("../integration", {recurse: true});
});
