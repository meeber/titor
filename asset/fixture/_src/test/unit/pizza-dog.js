import {expect} from "chai";
import PizzaDog from "../../lib/pizza-dog";

describe("pizzaDog", () => {
  it("has 42 fleas", () => {
    let fleas = PizzaDog();
    expect(fleas).to.equal(42);
  });
});
