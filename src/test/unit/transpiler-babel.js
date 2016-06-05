import sh from "../../lib/sh";
import sinonChai from "sinon-chai";
import {stub} from "sinon";
import TranspilerBabel from "../../lib/transpiler-babel";
import chai, {expect} from "chai";

chai.use(sinonChai);

describe("transpilerBabel", () => {
  describe("run babel without error", () => {
    let result;

    before(async () => {
      stub(sh, "execAsync").returns(Promise.resolve(42));

      result = await TranspilerBabel().run();
    });

    it("launch babel to transpile src/ to current-build/", () => {
      expect(sh.execAsync).to.be.calledWith(
        "BABEL_ENV=current babel -d current-build/ src/",
      );
    });

    it("launch babel to transpile src/ to legacy-build/", () => {
      expect(sh.execAsync).to.be.calledWith(
        "BABEL_ENV=legacy babel -d legacy-build/ src/",
      );
    });

    it("return a promise that's fulfilled with result", () => {
      expect(result).to.deep.equal([42, 42]);
    });

    after(() => sh.execAsync.restore());
  });

  describe("run babel with error", () => {
    let err;

    before(async() => {
      stub(sh, "execAsync").returns(Promise.reject(Error("pizza")));

      try {
        await TranspilerBabel().run();
      } catch (e) {
        err = e;
      }
    });

    it("return a promise that's rejected with error", () => {
      expect(err.message).to.equal("pizza");
    });

    after(() => sh.execAsync.restore());
  });
});
