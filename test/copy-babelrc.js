"use strict";

var chai = require("chai");
var copyBabelrc = require("../util/copy-babelrc");
var sh = require("shelljs");

var expect = chai.expect;

describe("copyBabelrc", function () {
  beforeEach(function () {
    if (sh.test("-e", ".babelrc")) sh.rm(".babelrc");
  });

  afterEach(function () {
    if (sh.test("-e", ".babelrc")) sh.rm(".babelrc");
  });

  it("should copy a .babelrc file to project root and return true",
  function () {
    expect(copyBabelrc()).to.be.true;
    expect(sh.test("-e", ".babelrc")).to.be.true;
  });

  it("should, if .babelrc already exists, return false", function () {
    copyBabelrc();

    expect(copyBabelrc()).to.be.false;
  });
});
