"use strict";

var path = require("path");
var sh = require("shelljs");

module.exports = function expectLintableFixed (type) {
  var fxtLintable = path.join(fxt, type, "lintable.js");

  it("fix linting issue", function () {
    expect(sh.cat(fxtLintable).stdout).to.equal("module.exports = {\n"
                                              + "  a: 1\n"
                                              + "};\n");
  });
};
