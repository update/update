# update [![NPM version](https://img.shields.io/npm/v/update.svg?style=flat)](https://www.npmjs.com/package/update) [![NPM downloads](https://img.shields.io/npm/dm/update.svg?style=flat)](https://npmjs.org/package/update) [![Build Status](https://img.shields.io/travis/jonschlinkert/update.svg?style=flat)](https://travis-ci.org/jonschlinkert/update)

Update your projects.

## Install

Install with [npm](https://www.npmjs.com/):

```sh
$ npm install --save update
```

## What is update?

Update is a new, open-source developer framework for automating updates of any kind to code projects. Using a combination of hrough the use of [updaters](#updaters) and [tasks](#tasks).  intuitive CLI, and a powerful and expressive API, Update is easy to learn, and enjoyable to use.

## tldr

Install `update` globally with the following command:

```js
$ npm install --global update
```

Update is installed globally and run with the `update` command.

* download
* git commit!
* run `update`

```js
var updater = require('update');
```

**Example**

This example shows two updaters working together seamlessly.

![Example of how to update a gulpfile.js](demo.gif)

**Want to know more?**

You can use update from the command line, or as a node.js library as a part of your own application.

* Jump to [feature highlights](#feature-highlights)
* Visit the [getting started guide](https://github.com/update/getting-started)

Continue on, and start updating!

## CLI

**Installing the CLI**

To run update from the command line, you'll need to install it globally first. You can do that now with the following command:

```sh
$ npm i -g update
```

This adds the `update` command to your system path, allowing it to be run from any directory.

You should now be able to use the `update` command to execute code in a local `updatefile.js` file, or to execute globally installed updaters by their [aliases](#aliases).

**Init**

If it's your first time using update, run `update init` to set your global defaults.

**Usage**

```
Usage: update <command> [options]

Command: Generator or tasks to run

Examples:

  # run the "foo" updater
  $ update foo

  # run the "bar" task on updater "foo"
  $ update foo:bar

  # run multiple tasks on updater "foo"
  $ update foo:bar,baz,qux

  # run a sub-updater on updater "foo"
  $ update foo.abc

  # run task "xyz" on sub-updater "foo.abc"
  $ update foo.abc:xyz

  Update attempts to automatically determine if "foo" is a task or updater.
  If there is a conflict, you can force update to run updater "foo"
  by specifying a task on the updater. Example: `update foo:default`
```

## Quickstart

The following intro only skims the surface of what update has to offer. For a more in-depth introduction, we highly recommend visiting the [getting started guide](https://github.com/update/getting-started).

**Create a updater**

Add a `updatefile.js` to the current working directory with the following code:

```js
module.exports = function(app) {
  console.log('success!');
};
```

**Run a updater**

Enter the following command:

```sh
update
```

If successful, you should see `success!` in the terminal.

**Create a task**

Now, add a task to your updater.

```js
module.exports = function(app) {
  app.task('default', function(cb) {
    console.log('success!');
    cb();
  });
};
```

Now, in the command line, run:

```sh
$ update
# then try
$ update default
```

When a local `updatefile.js` exists, the `update` command is aliased to automatically run the `default` task if one exists. But you can also run the task with `update default`.

**Run a task**

Let's try adding more tasks to your updater:

```js
module.exports = function(app) {
  app.task('default', function(cb) {
    console.log('default > success!');
    cb();
  });
  
  app.task('foo', function(cb) {
    console.log('foo > success!');
    cb();
  });

  app.task('bar', function(cb) {
    console.log('bar > success!');
    cb();
  });
};
```

Now, in the command line, run:

```sh
$ update
# then try
$ update foo
# then try
$ update foo bar
```

**Run task dependencies**

Now update your code to the following:

```js
module.exports = function(app) {
  app.task('default', ['foo', 'bar']);
  
  app.task('foo', function(cb) {
    console.log('foo > success!');
    cb();
  });

  app.task('bar', function(cb) {
    console.log('bar > success!');
    cb();
  });
};
```

And run:

```sh
$ update
```

You're now a master at running tasks with update! You can do anything with update tasks that you can do with [gulp](http://gulpjs.com) tasks (we use and support gulp libraries after all!).

**Next steps**

But update does much more than this. For a more in-depth introduction, we highly recommend visiting the [getting started guide](https://github.com/update/getting-started).

## More info

### Feature highlights

Update offers an elegant and robust suite of methods, carefully organized to help you accomplish common activities in less time, including:

* **unparalleled flow control**: through the use of [updaters](https://github.com/update/getting-started), [sub-updaters](https://github.com/update/getting-started) and [tasks](https://github.com/update/getting-started)
* **templates, scaffolds and boilerplates**: update a single file, initialize an entire project, or provide ad-hoc "components" throughout the duration of a project using any combination of [templates, scaffolds and boilerplates](#templates-scaffolds-and-boilerplates).
* **any engine**: use any template engine to render templates, including [handlebars](http://www.handlebarsjs.com/), [lodash](https://lodash.com/), [swig](https://github.com/paularmstrong/swig) and [pug](http://jade-lang.com)
* **prompts**: asks you for data when it can't find what it needs, and it's easy to customize prompts for any data you want.
* **data**: gathers data from the user's environment to populate "hints" in user prompts and render templates
* **streams**: interact with the file system, with full support for [gulp](http://gulpjs.com) and [assemble](https://github.com/assemble/assemble) plugins
* **smart plugins**: Update is built on [base](https://github.com/node-base/base), so any "smart" plugin can be used
* **stores**: persist configuration settings, global defaults, project-specific defaults, answers to prompts, and so on.

Visit the [getting started guide](https://github.com/update/getting-started) to learn more.

### FAQ

<a name="aliases">

**What's an alias, and what do they do?**

Update tries to find globally installed updaters using an "alias" first, falling back on the updater's full name if not found by its alias.

A updater's alias is created by stripping the substring `update-` from the _full name_ of updater. Thus, when publishing a updater the naming convention `update-foo` should be used (where `foo` is the alias, and `update-foo` is the full name).

Note that **no dots may be used in published updater names**. Aside from that, any characters considered valid by npm are fine.

## Contributing

This document was generated by [verb-readme-generator](https://github.com/verbose/verb-readme-generator) (a [verb](https://github.com/verbose/verb) generator), please don't edit directly. Any changes to the readme must be made in [.verb.md](.verb.md). See [Building Docs](#building-docs).

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](../../issues/new). Or visit the [verb-readme-generator](https://github.com/verbose/verb-readme-generator) project to submit bug reports or pull requests for the readme layout template.

## Building docs

Generate readme and API documentation with [verb](https://github.com/verbose/verb):

```sh
$ npm install -g verb verb-readme-generator && verb
```

## Running tests

Install dev dependencies:

```sh
$ npm install -d && npm test
```

## Author

**Jon Schlinkert**

* [github/jonschlinkert](https://github.com/jonschlinkert)
* [twitter/jonschlinkert](http://twitter.com/jonschlinkert)

## License

Copyright © 2016, [Jon Schlinkert](https://github.com/jonschlinkert).
Released under the [MIT license](LICENSE).

***

_This file was generated by [verb](https://github.com/verbose/verb), v0.9.0, on June 13, 2016._