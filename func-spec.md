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

Stuart is a fine programmer with a fresh idea for a library. Brimming with excitement, he sits down at his workstation, cracks his knuckles, and starts banging away at the keyboard. Several hours pass with little let up. From the outside, it appears that Stuart is making rapid progress on his idea, but in reality he hasn't written a single line of code! The problem is that Stuart is prone to procrastination via tooling. He spent the whole day messing around with libraries, writing build scripts, and tweaking the structure of his project directory. By the time he has to head out to Monday Pilates, all of his momentum is gone. If only Stuart had used Titor, he could've started coding within minutes of sitting down, directing his energy where it actually matters.

Gertrude knows what Gertrude wants, and what Gertrude wants is to use `async` and `await` in the library she's writing. But there's a problem: Although an experienced programmer, Gertrude is new to Node.js. She has read a couple articles about transpiling, but when it comes to selecting the right tools, building a complete project workflow, and distributing her library to consumers, she finds herself buried by choice and confusion. Maybe one day she'll get around to learning it all, but for now, the benefit just ain't worth the effort, so back to callbacks she goes. If only Gertrude had known about Titor, she could've jumped straight to working with future language features, allowing her to learn at a natural pace, without impeding progress on her project.

Elijah is a seasoned professional. He can manually bootstrap a project with transpiling, bundling, and source mapping in the amount of time it takes to eat a plate of curly fries. But just because he can do it doesn't mean he should. Elijah has more pressing pursuits. If only Elijah had Titor in his toolkit, he could wire up a new project in seconds, leaving more time for coding and curly fries.

## Installation

It all starts with a little `npm install --save-dev titor`.

Titor has an unusually high number of peer depedencies. There's a setup script detailed below that simplifies the installation of them.

## Usage

Titor is designed to be used via the commandline tool. Or rather, it's designed to be used via simple npm scripts that invoke the commandline tool. There's a setup script detailed below that automates adding npm scripts to a project's **package.json**.

The commandline tool is powered by the Titor API. Although the commandline tool is the recommended way to use Titor, there's nothing preventing the API from being used directly instead. The Titor API can be made available via `const titor = require("titor")`.

**Technical Note:** Titor's test suite is divided into unit tests and integration tests. Each unit test only tests one api call, faking other api calls as well as any database and filesystem access. Integration tests are performed on the commandline tool, and don't fake anything.

## Configuration

Titor is not intended to be a highly customizable tool. Nevertheless, there are a handful of configuration options available to consumers, primarily pertaining to which steps the build script should perform. These options can be set in `.titorrc.yml` in the project's root directory.

There's only one required configuration option:

- `export`: Name of the **package export**. Typically the package name written in camelCase. Browser bundles expose this variable as a global.

The following are optional configuration options:

- `bundle`: If true, create browser bundles during build process.
- `cover`: If true, calculate test coverage whenever testing `src/`.
- `coverReport`: If true, submit test coverage to coveralls.io during travis build.
- `test`: If true, run tests during build process.
- `lint`: If true, lint `src/` and `test/` when running tests.

Any of the configuration files for Titor's peer dependencies can be fully customized as well.

## Setup Script

Titor's setup script can be run in one of two ways:
1. Via CLI: `./node_modules/.bin/titor setup`
1. Via API: `titor.setup();`

Most consumers will launch the setup script using the first method shortly after installing Titor.

The setup script does the following:
1. Make a backup of package.json named package.json.save
1. Edit package.json:
    - Set main to build/
    - Add Titor's peerDependencies
    - Add Titor's scripts
1. Create the following files:
    - .babelrc
    - .eslintignore
    - .eslintrc.yml
    - .gitignore
    - .titorrc.yml
    - .travis.yml
    - src/api/**<package-export>**.js
    - src/bin/**<package-export>**.js
    - src/lib/example-lib.js
    - src/test/.eslintrc.yml
    - src/test/unit/example-unit-test.js
    - src/test/integration/example-integration-test.js
    - src/test/bootstrap/common.js
    - src/test/bootstrap/current.js
    - src/test/bootstrap/legacy.js

All paths are relative to the project root. If a file already exists, then it's skipped. Some files have placeholders in their content that are replaced during copy with the **package-export** in camelCase.

It's intentional that the setup script must be manually (as opposed to automatically) run after installing Titor. It'd be too intrusive to perform all of these changes automatically via an npm installation hook.
