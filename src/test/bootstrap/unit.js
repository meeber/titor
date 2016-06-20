"use strict";

require("./common");

describe("unit", () => {
  require("require-dir")("../unit", {recurse: true});
});
