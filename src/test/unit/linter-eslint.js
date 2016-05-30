import chai from "chai";
import LinterEslint from "../../lib/linter-eslint";
import sinon from "sinon";
import sinonChai from "sinon-chai";

chai.use(sinonChai);

let expect = chai.expect;

describe("linterEslint", () => {
  describe("run", () => {
    it("launch eslint", () => {
      let sh = {exec: sinon.spy()};
      let linter = LinterEslint(sh);

      linter.run();

      expect(sh.exec).to.be.calledWith("eslint --fix .");
    });
  });
});
