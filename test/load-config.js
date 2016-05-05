"use strict";

var chai = require("chai");
var loadConfig = require("../util/load-config");
var sh = require("shelljs");

var expect = chai.expect;

describe("loadConfig", function () {
  afterEach(function () {
    if (sh.test("-e", ".titorrc")) sh.rm(".titorrc");
  });

  beforeEach(function () {
    sh.cp("test/resource/good.titorrc", ".titorrc");
  });

  it("should return a config object", function () {
    expect(loadConfig()).to.be.an("object").with.property("export");
  });

  it("should, if no .titorrc, throw", function () {
    sh.rm(".titorrc");

    expect(loadConfig).to.throw(/no such file/);
  });

  it("should, if invalid .titorrc, throw", function () {
    sh.cp("test/resource/bad-format.titorrc", ".titorrc");

    expect(loadConfig).to.throw("Invalid .titorrc");
  });

  it("should, if invalid export, throw", function () {
    sh.cp("test/resource/bad-export.titorrc", ".titorrc");

    expect(loadConfig).to.throw(/Invalid or missing export/);
  });
});
