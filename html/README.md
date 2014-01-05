# Web-Essentials-Bootstrap [![Build Status](https://api.travis-ci.org/ssiops/we-bs.png)](https://travis-ci.org/ssiops/we-bs) [![devDependency Status](https://david-dm.org/ssiops/we-bs/dev-status.png)](https://david-dm.org/ssiops/we-bs#info=devDependencies)

> Essential components to start a static website using Bootstrap

## Quick Start

This templage uses [Grunt](http://gruntjs.com/) with convenient methods for working with the framework. It's how we compile our code, run tests, and more. To use it, install the required dependencies as directed and then run some Grunt commands.

### Install Grunt

From the command line:

1. Install `grunt-cli` globally with `npm install -g grunt-cli`.
2. Install the [necessary local dependencies](package.json) via `npm install`

When completed, you'll be able to run the various Grunt commands provided from the command line.

**Unfamiliar with `npm`? Don't have node installed?** That's a-okay. npm stands for [node packaged modules](http://npmjs.org/) and is a way to manage development dependencies through node.js. [Download and install node.js](http://nodejs.org/download/) before proceeding.

### Available Grunt commands

#### Build and Assemble - `grunt`
Run tests locally, compile CSS and JavaScript, assemble templage pages into `/dist`

#### Build - `grunt build`
Run `grunt` to run tests locally and compile the CSS and JavaScript into `/dist`. **Requires [recess](https://github.com/twitter/recess) and [uglify-js](https://github.com/mishoo/UglifyJS).**

#### Tests - `grunt test`
Runs jshint and qunit tests headlessly in [phantomjs](https://github.com/ariya/phantomjs/) (used for CI). **Requires [phantomjs](https://github.com/ariya/phantomjs/).**

#### Developing - `grunt dev`
This is a convenience method for watching files and automatically building them whenever you save.
