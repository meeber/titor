import {lint} from "../../lib/linter-eslint";
import sh from "../../lib/sh";

describe("LinterEslint", () => {
  describe("run eslint without error", () => {
    let result;

    before(async () => {
      stub(sh, "execAsync").returns(Promise.resolve(42));

      result = await lint();
    });

    it("launches eslint", () => {
      expect(sh.execAsync).to.be.calledWith("eslint --fix .");
    });

    it("returns a promise that's fulfilled with result", () => {
      expect(result).to.equal(42);
    });

    after(() => sh.execAsync.restore());
  });

  describe("run eslint with error", () => {
    let err;

    before(async () => {
      stub(sh, "execAsync").returns(Promise.reject(Error("pizza")));

      try {
        await lint();
      } catch (e) {
        err = e;
      }
    });

    it("returns a promise that's rejected with error", () => {
      expect(err.message).to.equal("pizza");
    });

    after(() => sh.execAsync.restore());
  });
});
