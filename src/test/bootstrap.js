"use strict";

const {config} = require("../lib/sh");
const sinonChai = require("sinon-chai");
const {stub} = require("sinon");
const chai = require("chai");

config.silent = true;

chai.use(sinonChai);

Object.assign(global, {expect: chai.expect, stub});
