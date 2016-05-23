"use strict";

var setupPackageJson = require("../../util/setup-package-json");

describe("setupPackageJson", function () {
  var curPj, newPj;

  beforeEach(function () {
    curPj = {
      name: "test-package",
      version: "0.0.0",
      description: "a test package",
    };

    newPj = {
      name: "test-package",
      version: "0.0.0",
      description: "a test package",
      main: "build/",
      dependencies: {
        semver: "^5.1.0",
      },
      devDependencies: {
        "babel-cli": "^6.9.0",
        "babel-core": "^6.9.0",
        "babel-eslint": "^6.0.4",
        "babel-plugin-add-module-exports": "^0.2.1",
        "babel-plugin-transform-es2015-modules-commonjs": "^6.8.0",
        "babel-polyfill": "^6.9.0",
        "babel-preset-es2015": "^6.9.0",
        "babel-preset-stage-0": "^6.5.0",
        browserify: "^13.0.1",
        chai: "^3.5.0",
        coveralls: "^2.11.9",
        eslint: "^2.10.2",
        exorcist: "^0.4.0",
        istanbul: "^1.0.0-alpha.2",
        mocha: "^2.5.1",
      },
      scripts: {
        build: "titor build",
        bundle: "titor bundle",
        clean: "titor clean",
        lint: "titor lint",
        test: "titor test",
        travis: "titor travis",
      },
    };
  });

  describe("curPj has a minimal configuration", function () {
    it("return configured packageJson object", function () {
      expect(setupPackageJson(curPj)).to.deep.equal(newPj);
    });

    it("don't modify curPj", function () {
      setupPackageJson(curPj);

      expect(curPj).to.deep.equal({
        name: "test-package",
        version: "0.0.0",
        description: "a test package",
      });
    });
  });

  describe("curPj has semver in devDependencies", function () {
    it("remove semver from devDependencies in returned object", function () {
      curPj.devDependencies = {semver: "^5.1.0"};

      expect(setupPackageJson(curPj)).to.deep.equal(newPj);
    });
  });
});
