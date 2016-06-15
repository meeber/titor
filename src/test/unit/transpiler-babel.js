"use strict";

const proxyquire = require("proxyquire");

describe("TranspilerBabel", () => {
  describe("run babel without error", () => {
    const execAsyncStub = stub().returns(Promise.resolve(42));
    const {transpile} = proxyquire(
      "../../lib/transpiler-babel",
      {"./sh": {execAsync: execAsyncStub}},
    );

    let result;

    before(async () => {
      result = await transpile();
    });

    it("launches babel to transpile src/ to current-build/", () => {
      expect(execAsyncStub).to.be.calledWith(
        "BABEL_ENV=current babel -s -d current-build/ src/",
      );
    });

    it("launches babel to transpile src/ to legacy-build/", () => {
      expect(execAsyncStub).to.be.calledWith(
        "BABEL_ENV=legacy babel -s -d legacy-build/ src/",
      );
    });

    it("returns a promise that's fulfilled with result", () => {
      expect(result).to.deep.equal([42, 42]);
    });
  });

  describe("run babel with error", () => {
    const execAsyncStub = stub().returns(Promise.reject(Error("pizza")));
    const {transpile} = proxyquire(
      "../../lib/transpiler-babel",
      {"./sh": {execAsync: execAsyncStub}},
    );

    let err;

    before(async() => {
      try {
        await transpile();
      } catch (e) {
        err = e;
      }
    });

    it("returns a promise that's rejected with error", () => {
      expect(err.message).to.equal("pizza");
    });
  });
});
