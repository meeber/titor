"use strict";

var clone = require("../../lib/clone");

describe("clone", function () {
  describe("obj is nested", function () {
    var clonedObj, obj;

    before(function () {
      obj = {a: {b: 1, c: [2, {d: "blah"}]}, e: {f: [{g: [7]}]}};

      clonedObj = clone(obj);
    });

    it("return an object that's deep-equally to obj", function () {
      expect(clonedObj).to.deep.equal(obj);
    });

    it("return an object that's not strictly-equal to obj", function () {
      expect(clonedObj).to.not.equal(obj);
    });
  });
});
