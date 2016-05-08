[![build status](https://img.shields.io/travis/meeber/titor.svg)](https://travis-ci.org/meeber/titor)
[![coverage status](https://img.shields.io/coveralls/meeber/titor.svg)](https://coveralls.io/github/meeber/titor)
[![npm version](https://img.shields.io/npm/v/titor.svg)](https://www.npmjs.com/package/titor)

# Titor

JavaScript build and bundle assistant.

Write your source code and tests using the latest language features, and then sit back and relax while Titor:

- Creates two builds:
    1. **Current**: Minimally transpiled to Node v6.0.0
    2. **Legacy**: Fully transpiled to ES5
- Runs your tests (with lint & coverage) on your source and builds
- Creates a browser bundle for each build
- Creates a browser bundle for each build's tests 

All builds and bundles come with full source map support.

Consumers who import your package automatically receive the best build based on their Node version.

# Background

In the year 2026, corporeal time-travel is added to the CERNScript specification, further widening the gap between the elite ruling class and the rest of the world's population who are still stuck using ECMAScript 5 due to browser compatibility concerns.

After 10 years of CERN tyranny, a rebel named John Titor, armed only with an IBM 5100, manages to hack CERN's database and steal the specification. With his newfound knowledge, Titor travels back in time to the year 2016.

His goal is singular: Prevent his dystopian future from becoming a reality by empowering developers to embrace ECMAScript 2015 and beyond.

# Install

- `npm install --save-dev titor`

# Setup

1. Add to your package.json:

        "main": "build/",
        "scripts": {
          "build": "titor-build",
          "bundle": "titor-bundle",
          "clean": "titor-clean",
          "lint": "titor-lint",
          "postversion": "titor-postversion",
          "preversion": "titor-preversion",
          "release": "titor-release",
          "setup": "titor-setup",
          "test": "titor-test",
          "travis": "titor-travis"
        }

1. `npm run setup`

# Usage

- `npm run build`:
    1. Optionally run all of your tests against `src/`
    1. Optionally lint `src/` and `test/`
    1. Optionally calculate test coverage of `src/`
    1. Create `current` and `legacy` builds based on `src/`
    1. Optionally run your package export tests against the best build for your version of Node
    1. Optionally create browser bundles for each build and each build's tests

- `npm run bundle`:
    1. Create browser bundles for each build and each build's tests

- `npm run clean`:
    1. Delete all builds, bundles, and test coverage reports

- `npm run lint`:
    1. Lint `src/` and `test/`

- `npm run release [patch|minor|major]`:
    1. Check out master branch
    1. Merge dev branch into master branch
    1. Launch `npm run build`
    1. Bump `version` in `package.json` and commit changes
    1. Tag release version
    1. Check out dev branch
    1. Merge master branch into dev branch
    1. Push changes
    1. Publish to npm

- `npm run setup`:
    1. Install `semver` dependency and save in `package.json`
    1. Create `.babelrc` if it doesn't exist
    1. Create `.eslintignore` if it doesn't exist
    1. Create `.eslintrc.yml` if it doesn't exist
    1. Create `.titorrc.yml` if it doesn't exist
    1. Create `.travis.yml` if it doesn't exist
    1. Create `src/index.js` if it doesn't exist
    1. Create `test/index.js` if it doesn't exist

- `npm test`:
    1. Run all of your tests against `src/`
    1. Optionally calculate test coverage of `src/`
    1. Optionally lint `src/` and `test/`
    1. Run your package export tests against the best build for your version of Node

- `npm test src`:
    1. Run all of your tests against `src/`
    1. Optionally calculate test coverage of `src/`
    1. Optionally lint `src/` and `test/`

- `npm test [current|legacy]`:
    1. Run your package export tests against the specified build

# Config

Titor requires a `.titorrc.yml` file in your package root.

Required:

- `export`: Variable name of your package export. Typically your package name written in CamelCase. Browser bundles expose this variable as a global.

Optional:

- `bundle`: If true, create browser bundles during build process.
- `cover`: If true, calculate test coverage whenever testing `src/`.
- `coverReport`: If true, submit test coverage to coveralls.io during travis build.
- `test`: If true, run tests during build process.
- `lint`: If true, lint `src/` and `test/` when running tests.

Example:

```js
{
  bundle: true,
  cover: true,
  coverReport: true,
  export: "chaiAssertX",
  lint: true,
  test: true,
}
```

# Consumers

Let's pretend you create a package named "cheeseball" using Titor, and then publish it on npm.

After a consumer runs `npm install cheeseball`, they can import your package into their package in one of three ways:

1. `var cheeseball = require("cheeseball")`: Automatically import the best build based on the consumer's Node version.
1. `var cheeseball = require("cheeseball/build/current")`: Import the **current** build of your package.
1. `var cheeseball = require("cheeseball/build/legacy")`: Import the **legacy** build of your package.

Alternatively, they can grab a browser bundle for either build of your package from the `bundle` folder. These bundles expose your package export as a global variable.

# Shims and Polyfills

For many packages using the latest language features, shims are needed in order for your code to work in legacy versions of node and browsers. Shims are not included in the legacy builds created by Titor. This is on purpose because it's considered a bad practice among the JavaScript community for a package to muck with globals.

Therefore, it's your responsibilty to inform consumers which shims they will need (if any) when importing your package in legacy environments. The nuclear option is to advise consumers to `npm install babel-polyfill` and `require("babel-polyfill")` in the entry point of their package. One alternative is to pick and choose shims from the [core-js](https://github.com/zloirock/core-js) package.

Titor automatically registers shims when:

1. Running tests of your legacy build
1. Running tests of your source code from within a legacy environment
1. Creating the legacy test bundle for your package.

# Examples

- https://github.com/meeber/chai-assert-x

# License

MIT

# Beware

- This package is in its infancy and subject to jarring improvements

# GLHFDD
