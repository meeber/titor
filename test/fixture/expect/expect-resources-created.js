"use strict";

var path = require("path");
var sh = require("shelljs");

var rsc = path.join(__dirname, "../../../resource");

var RESOURCES = [
  {
    name: ".babelrc",
    src: path.join(rsc, "_.babelrc"),
    dst: path.join(fxt, ".babelrc"),
  },
  {
    name: ".eslintignore",
    src: path.join(rsc, "_.eslintignore"),
    dst: path.join(fxt, ".eslintignore"),
  },
  {
    name: ".eslintrc.yml",
    src: path.join(rsc, "_.eslintrc.yml"),
    dst: path.join(fxt, ".eslintrc.yml"),
  },
  {
    name: ".gitignore",
    src: path.join(rsc, "_.gitignore"),
    dst: path.join(fxt, ".gitignore"),
  },
  {
    name: "test/.eslintrc.yml",
    src: path.join(rsc, "test/_.eslintrc.yml"),
    dst: path.join(fxt, "test/.eslintrc.yml"),
  },
  {
    name: "test/fixture/common.js",
    src: path.join(rsc, "test/fixture/_common.js"),
    dst: path.join(fxt, "test/fixture/common.js"),
  },
  {
    name: "test/fixture/current.js",
    src: path.join(rsc, "test/fixture/_current.js"),
    dst: path.join(fxt, "test/fixture/current.js"),
  },
  {
    name: "test/fixture/legacy.js",
    src: path.join(rsc, "test/fixture/_legacy.js"),
    dst: path.join(fxt, "test/fixture/legacy.js"),
  },
  {
    name: "test/fixture/src.js",
    src: path.join(rsc, "test/fixture/_src.js"),
    dst: path.join(fxt, "test/fixture/src.js"),
  },
  {
    name: ".titorrc.yml",
    src: path.join(rsc, "_.titorrc.yml"),
    dst: path.join(fxt, ".titorrc.yml"),
  },
  {
    name: ".travis.yml",
    src: path.join(rsc, "_.travis.yml"),
    dst: path.join(fxt, ".travis.yml"),
  },
  {
    name: "src/package-export.js",
    src: path.join(rsc, "src/_package-export.js"),
    dst: path.join(fxt, "src/test-package.js"),
  },
  {
    name: "test/package-export.test.js",
    src: path.join(rsc, "test/_package-export.test.js"),
    dst: path.join(fxt, "test/test-package.test.js"),
  },
];

module.exports = function expectResourcesCreated (nameExists) {
  RESOURCES.forEach(function (resource) {
    var description = resource.name === nameExists
                    ? "don't overwrite existing " + resource.name
                    : "copy customized " + resource.name + " from resources";

    it(description, function () {
      var expected = resource.name === nameExists
                    ? "pizza"
                    : sh.sed("PACKAGE_EXPORT", "testPackage", resource.src)
                        .sed("PACKAGE_FILE", "test-package")
                        .stdout;

      expect(sh.cat(resource.dst).stdout).to.equal(expected);
    });
  });
};
