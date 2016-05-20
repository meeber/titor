"use strict";

var clone = require("../../util/clone");

describe("clone", function () {
  it("should return a deep-copied clone of obj", function () {
    var obj = {a: {b: 1, c: [2, {d: "blah"}]}, e: {f: [{g: [7]}]}};

    var clonedObj = clone(obj);

    expect(clonedObj).to.deep.equal(obj);
    expect(clonedObj).to.not.equal(obj);
  });
});
