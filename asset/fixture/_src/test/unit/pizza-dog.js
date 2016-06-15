const {expect} = require("chai");
const pizzaDog = require("../../lib/pizza-dog");

describe("pizzaDog", () => {
  it("is half-pizza and half-dog", () => {
    expect(pizzaDog(42)).to.equal(84);
  });
});
