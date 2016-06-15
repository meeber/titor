"use strict";

require("./common");

describe("integration", () => {
  // eslint-disable-next-line global-require
  require("require-dir")("../integration", {recurse: true});
});
