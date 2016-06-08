import {config} from "../lib/sh";
import sinonChai from "sinon-chai";
import {stub} from "sinon";
import chai, {expect} from "chai";

config.silent = true;

chai.use(sinonChai);

Object.assign(global, {expect, stub});
