"use strict";

require("./common");

describe("unit", () => {
  // eslint-disable-next-line global-require
  require("require-dir")("../unit", {recurse: true});
});
