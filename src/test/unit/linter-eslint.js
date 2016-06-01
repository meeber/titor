import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import LinterEslint from "../../lib/linter-eslint";
import sinon from "sinon";
import sinonChai from "sinon-chai";

chai.use(chaiAsPromised);
chai.use(sinonChai);

let expect = chai.expect;

describe("linterEslint", () => {
  describe("run successfully", () => {
    let result, sh;

    before(() => {
      sh = {execAsync: sinon.stub().returns(Promise.resolve())};

      let linter = LinterEslint(sh);

      result = linter.run();
    });

    it("launch eslint", () => {
      expect(sh.execAsync).to.be.calledWith("eslint --fix .");
    });

    it("return a promise that resolves", () =>
      expect(result).to.eventually.be.fulfilled
    );
  });

  describe("run with error", () => {
    let result, sh;

    before(() => {
      sh = {execAsync: sinon.stub().returns(Promise.reject())};

      let linter = LinterEslint(sh);

      result = linter.run();
    });

    it("return a promise that resolves", () =>
      expect(result).to.eventually.be.rejected
    );
  });
});
