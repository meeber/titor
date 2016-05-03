# Titor

JavaScript build and bundle assistant.

Write your source code and tests using the latest language features, and then sit back and relax while Titor:

- Creates three builds:
    1. **Current**: Minimally transpiled to the latest version of Node
    2. **Legacy**: Fully transpiled to ES5
    3. **Legacy-shim**: Fully transpiled to ES5 + fully shimmed
- Serves your consumers the best build based on their Node version
- Runs your tests (with lint & coverage) on your source and builds
- Creates a browser bundle for each build
- Creates a browser bundle for each build's tests 

All builds and bundles come with full source map support.

# Background

In the year 2026, corporeal time-travel is added to the CERNScript specification, further widening the gap between the elite ruling class and the rest of the world's population who are still stuck using ECMAScript 5 due to browser compatibility concerns.

After 10 years of CERN tyranny, a rebel named John Titor, armed only with an IBM 5100, manages to hack CERN's database and steal the specification. With his newfound knowledge, Titor travels back in time to the year 2016.

His goal is singular: Prevent his dystopian future from becoming a reality by empowering developers to master ECMAScript 2015 and beyond.

# Install

`npm install --save-dev titor`
`npm install --save titor-util`

# Setup

Add to your package.json:

```js
  "main": "build/",
  "scripts": {
    "build": "titor-build",
    "bundle": "titor-bundle",
    "clean": "titor-clean",
    "lint": "titor-lint",
    "postversion": "titor-postversion",
    "preversion": "titor-preversion",
    "release": "titor-release",
    "test": "titor-test"
  }
```

Create `.titorrc` in project root with a minimum of `export` and `minCurNodeVer` defined. See: [Config](#Config).

Create `src/` directory to hold all your source code. Create `src/index.js` as your project's entry-point with a `default export` named after the `export` in `.titorrc`.

Create `test/` directory to hold all your tests. Create `test/index.js` to test your `export`. Don't `require("../src/index.js")` from within `test/index.js`; your `export` will automatically be provided as a global during tests. However, other test files will need to require their associated source files.

# Usage

- `npm run build`:
    1. Optionally run all of your tests against `src/`
    1. Optionally lint `src/` and `test/`
    1. Optionally calculate test coverage of `src/`
    1. Create `current`, `legacy`, and `legacy-shim` builds based on `src/`
    1. Optionally run your mainExport tests against the best build for your version of Node
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

- `npm test`:
    1. Run all of your tests against `src/`
    1. Optionally calculate test coverage of `src/`
    1. Optionally lint `src/` and `test/`
    1. Run your mainExport tests against the best build for your version of Node

- `npm test coverage`:
    1. Run all of your tests against `src/`
    1. Calculate test coverage of `src/`
    1. Optionally lint `src/` and `test/`

- `npm test src`:
    1. Run all of your tests against `src/`
    1. Optionally lint `src/` and `test/`

- `npm test [current|legacy|legacy-shim]`:
    1. Run your mainExport tests against the specified build

# Config

Titor requires a `.titorrc` file in the root of the project. This file may be in YAML or JSON format.

Required:

- `export`: Variable name of your project's default export. Typically your project's name written in CamelCase. Browser bundles expose this variable as a global.
- `minCurNodeVer`: Minimum version of Node required to use the `current` build.

Optional:

- `bundle`: If true, create browser bundles during build process.
- `lint`: If true, lint `src/` and `test/` when running tests.
- `shimCheck`: Name of the global that, if missing, means shimming is required (e.g., "Reflect").
- `test`: If true, run tests and calculate test coverage during build process.

# Consumers

Let's pretend you create a library named "cheeseball" using Titor, and then publish it on npm.

After a consumer runs `npm install cheeseball`, they can import your library into their project in one of four ways:

- `var cheeseball = require("cheeseball")`: Auto-detect which build to import based on the version of the consumer's Node and the config you specified in `.titorrc`.
- `var cheeseball = require("cheeseball/build/current")`: Import the current build of your library.
- `var cheeseball = require("cheeseball/build/legacy")`: Import the legacy build of your library.
- `var cheeseball = require("cheeseball/build/legacy-shim")`: Import the legacy build of your library along with shims.

Alternatively, they can grab a browser bundle for any of the three builds of your library from their project's `node_modules/cheeseball/bundle` folder. These bundles expose the default export of your library as a global variable.

It's recommended that consumers use either the **current** or **legacy** builds and bundles. The **legacy-shim** build is a nuclear option. It drastically increases the size of the code. When it comes to shimming, it's typically better for you to inform consumers which features your project requires, and then advise them on the best way to obtain shims for those features if needed.

# Examples

- https://github.com/meeber/chai-assert-x

# License

MIT

# Beware

- This project is in its infancy and subject to jarring change

# GLHFDD
