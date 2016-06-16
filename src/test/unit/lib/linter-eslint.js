"use strict";

const proxyquire = require("proxyquire").noPreserveCache();

describe("LinterEslint", () => {
  describe("run eslint without error", () => {
    const execAsyncStub = stub().returns(Promise.resolve(42));
    const {lint} = proxyquire(
      "../../../lib/linter-eslint",
      {"./sh": {execAsync: execAsyncStub}},
    );

    let result;

    before(async () => {
      result = await lint();
    });

    it("launches eslint", () => {
      expect(execAsyncStub).to.be.calledWith("eslint --fix .");
    });

    it("returns a promise that's fulfilled with result", () => {
      expect(result).to.equal(42);
    });
  });

  describe("run eslint with error", () => {
    const execAsyncStub = stub().returns(Promise.reject(Error("pizza")));
    const {lint} = proxyquire(
      "../../../lib/linter-eslint",
      {"./sh": {execAsync: execAsyncStub}},
    );

    let err;

    before(async () => {
      try {
        await lint();
      } catch (e) {
        err = e;
      }
    });

    it("returns a promise that's rejected with error", () => {
      expect(err.message).to.equal("pizza");
    });
  });
});
