import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import sinon from "sinon";
import sinonChai from "sinon-chai";
import TranspilerBabel from "../../lib/transpiler-babel";

chai.use(chaiAsPromised);
chai.use(sinonChai);

let expect = chai.expect;

describe("transpilerBabel", () => {
  describe("run successfully", () => {
    let result, sh;

    before(() => {
      sh = {execAsync: sinon.stub().returns(Promise.resolve())};

      let transpiler = TranspilerBabel(sh);

      result = transpiler.run();
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

    it("return a fulfilled promise", () =>
      expect(result).to.eventually.be.fulfilled
    );
  });

  describe("run with error", () => {
    let result, sh;

    before(() => {
      sh = {execAsync: sinon.stub().returns(Promise.reject())};

      let transpiler = TranspilerBabel(sh);

      result = transpiler.run();
    });

    it("return a rejected promise", () =>
      expect(result).to.eventually.be.rejected
    );
  });
});
