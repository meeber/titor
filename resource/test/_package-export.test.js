/* global chai PACKAGE_EXPORT */

let expect = chai.expect;

describe("PACKAGE_EXPORT", () => {
  it("example test", () => {
    expect(PACKAGE_EXPORT).to.not.be.undefined;
  });
});
