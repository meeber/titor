# Titor Functional Specification

## Backstory

In the year 2036, corporeal time-travel is added to the CERNScript specification, further widening the gap between the elite ruling class and the rest of the world's population who are still stuck using ECMAScript 5 due to browser compatibility concerns.

A rebel named John Titor, armed only with an IBM 5100, manages to hack CERN's database and steal the specification. With his newfound knowledge, Titor travels back in time to the year 2016.

His goal is singular: Prevent his dystopian future from becoming a reality by empowering developers to embrace ECMAScript 2015 and beyond.

## Overview

Titor is a Node.js package assistant.

The primary goal of Titor is to eliminate the barrier of entry for developing packages using the latest ECMAScript features. It accomplishes this goal by gluing together a bunch of proven libraries with some basic scripts.

Titor is very opinionated about which libraries you should use and how your project should be structured. It doesn't leave you much choice. This is intentional. Titor is from the future so it already knows what works. It'll make the unimportant decisions for you so that you can focus on what's important: what your project does.

## Scenarios

### The Procrastinator

Stuart is a fine programmer with a fresh idea for a library. Spec in hand, he sits down at his workstation, cracks his knuckles, and starts banging away at the keyboard. Several hours pass with little let up. From the outside, it appears that Stuart is making rapid progress on his project, but in reality he hasn't written a single line of code! The problem is that Stuart is prone to procrastination via tooling. He spent the whole day messing around with libraries, writing build scripts, and tweaking the structure of his project directory. By the time he has to head out to Monday Pilates, all of his momentum is gone. If only Stuart had used Titor, he could've started coding within minutes of sitting down, directing his energy where it actually matters.

### The Student

Gertrude knows what Gertrude wants, and what Gertrude wants is to use `async` and `await` in the library she's writing. But there's a problem: Although an experienced programmer, Gertrude is new to Node.js. She has read a couple articles about transpiling, but when it comes to selecting the right tools and building a complete project workflow, she finds herself buried by choice. Maybe one day she'll get around to learning it all, but for now, the benefit just ain't worth the effort, so back to callbacks she goes. If only Gertrude had known about Titor, she could've jumped straight to working with future language features, allowing her to learn at a natural pace, without impeding progress on her project.

### The Guru

Elijah is a seasoned professional. He can manually bootstrap a project with transpiling, bundling, and source mapping in the amount of time it takes to eat a plate of curly fries. But just because he can do it doesn't mean he should. Elijah has more pressing pursuits. If only Elijah had Titor in his toolkit, he could wire up a new project in seconds, leaving more time for coding and curly fries.

## Installation

It all starts with a little `npm install --save-dev titor`.

Titor has an unusually high number of peer depedencies. There's a setup script detailed below that simplifies the installation of them.

## Workflow

The typical Titor workflow is as follows:

1. Create a new project via `npm init`.
1. Install Titor via `npm install --save-dev titor`.
1. Run the Titor setup script via `./node_modules/.bin/titor setup`.
1. Start developing within the Titor-created directory structure.
1. Test source via `npm test`.
1. Build distributables via `npm run build`.

Titor is currently only recommended when starting a new project. With that said, it is possible for a consumer experienced with Titor to transition an existing project to make use of it.

It's easier to transition a project from using Titor to not using Titor than vice-versa. Consumers should not feel as if using Titor at the start of the project will cause them to be locked into that decision down the road.

## Project Structure

In order to operate correctly, Titor requires that the consumer maintain the project structure outlined below. The Titor setup script automates the creation of required directories and files.

- `my-project/`
    - `.babelrc`
    - `.eslintignore`
    - `.eslintrc.yml`
    - `.titorrc.yml`
    - `.travis.yml`
    - `package.json`
    - `asset/`: Project artifacts go here (no transpiling)
    - `dist-auto/`: Created via Titor build script
        - `api.js`: API entry point, auto-detects build
        - `cli.js`: CLI entry point, auto-detects build
        - `detect-build.js`: 
    - `dist-current/`: Created via Titor build script
        - `my-project.js`
        - `bin/`
          - `my-project.js`
        - `bundle/`
          - `my-project.js`: Browser bundle
          - `test/`: Browser test bundle
        - `test/`
    - `dist-legacy/`: Created via Titor build script
        - `my-project.js`
        - `bin/`
            - `my-project.js`
        - `bundle/`
            - `my-project.js`: Browser bundle
            - `test/`: Browser test bundle
        - `test/`
    - `src/`: Source code goes here
        - `my-project.js`: API entry point
        - `bin/`: CLI (optional)
            - `my-project.js`: CLI entry point (optional)
        - `test/`
            - `.eslintrc.yml`: Test-specific linting rules
            - `bootstrap/`: 
                - `common.js`: Test bootstrapping logic
                - `func.js`: Functional tests entry point
                - `unit.js`: Unit tests entry point
            - `func/`: Functional tests
            - `unit/`: Unit tests

The Titor codebase uses the same project structure that it forces upon consumres.

One of the goals of this directory scheme is for relative paths to remain consistent between source and dist directories. That's why the three `dist-*` directories aren't instead subdirectories within a single `dist` directory at the root.

Consumers are free to create additional files and directories within this structure; these are merely the files and directories that are required for Titor to function.

## Usage

Titor is designed to be used via the CLI. Or rather, it's designed to be used via simple npm scripts that interact with the CLI. There's a setup script detailed below that automates adding npm scripts to a project's `package.json`.

The CLI is powered by the API. Although the CLI is the recommended way to use Titor, there's nothing preventing the API from being used directly instead. The Titor API can be made available via `const titor = require("titor")`.

One key difference between the CLI and API is that the CLI automatically leverages a configuration file, as noted below, whereas nothing with the API is automated.

## Configuration

Titor is not intended to be a highly customizable tool. Nevertheless, there are a handful of configuration options available to consumers, primarily pertaining to which steps the build script should perform.

When using Titor's CLI, configuration values should be set in `.titorrc.yml` in the project's root directory. When using Titor's API, configuration values must be manually passed to methods.

The following is a list of configuration options:

- `export`: Name of the **package export**. Typically the package name written in camelCase. Browser bundles expose this variable as a global.
- `bundle`: If true, create browser bundles during build process.
- `cover`: If true, calculate test coverage whenever testing `src/`.
- `coverReport`: If true, submit test coverage to coveralls.io during travis build.
- `test`: If true, run tests during build process.
- `lint`: If true, lint `src/` when running tests.

Any of the configuration files for Titor's peer dependencies can be fully customized as well.

## Setup Script

Titor's setup script can be run in one of two ways:

1. Via CLI: `./node_modules/.bin/titor setup`
1. Via API: `titor.setup();`

Most consumers will launch the setup script using the first method shortly after installing Titor.

The setup script does the following:

1. Make a backup of `package.json` named `package.json.save`.
1. Edit `package.json`:
    - Set `main` to `build/`
    - Add Titor's `peerDependencies`
    - Add Titor's `scripts`
1. Create the following files:
    - `.babelrc`
    - `.eslintignore`
    - `.eslintrc.yml`
    - `.gitignore`
    - `.titorrc.yml`
    - `.travis.yml`
    - `src/api/<package-export>.js`
    - `src/bin/<package-export>.js`
    - `src/lib/example-lib.js`
    - `src/test/.eslintrc.yml`
    - `src/test/unit/example-unit-test.js`
    - `src/test/integration/example-integration-test.js`
    - `src/test/bootstrap/common.js`
    - `src/test/bootstrap/current.js`
    - `src/test/bootstrap/legacy.js`

All paths are relative to the project root. If a file already exists, then it's skipped. Some files have placeholders in their content that are replaced during copy with the **package-export** in camelCase.

It's intentional that the setup script must be manually run after installing Titor. It'd be too intrusive to perform all of these changes automatically via an npm installation hook.

**Technical note:** For npm v3.x or higher, consumers must then run `npm install` to install all of the peer dependencies that the setup script added to package.json. (Older versions of npm will install peer dependencies automatically when Titor is installed.)

## Build Script

Titor's build script can be run in one of three ways:

1. Via npm script: `npm run build`
1. Via CLI: `./node_modules/.bin/titor build`
1. Via API: `titor.build();`

The first two methods are functionally equivalent; they both pull configuration values from `.titorrc.yml`. The final method requires that the consumer manually pass in configuration values.

The build script does the following, aborting if any step fails:

1. Delete `current-build/` if it exists.
1. Delete `legacy-build/` if it exists.
1. (optional) Lint all `.js` files in `src/`.
1. Minimally transpile `src/` into `current-build/`.
1. Maximally transpile `src/` into `legacy-build/`.
