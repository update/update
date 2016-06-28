# update [![NPM version](https://img.shields.io/npm/v/update.svg?style=flat)](https://www.npmjs.com/package/update) [![NPM downloads](https://img.shields.io/npm/dm/update.svg?style=flat)](https://npmjs.org/package/update) [![Build Status](https://img.shields.io/travis/jonschlinkert/update.svg?style=flat)](https://travis-ci.org/jonschlinkert/update)

Update is a developer framework and CLI for automating updates of any kind in code projects. All updating is accomplished using plugins called _updaters_, which can be installed globally, locally, or in a local updatefile.js

<p align="center">
<a href="https://github.com/jonschlinkert/update">
<img height="250" width="250" src="https://raw.githubusercontent.com/jonschlinkert/update/master/docs/logo.png">
</a>
</p>

## The basics

* All of the actual _updating_ is accomplished by plugins called "updaters".
* [Updaters](docs/updaters.md) can be published to npm using the `updater-foo` naming convention, where `foo` is the updater's [alias](docs/faq.md#aliases).
* Run multiple updaters by passing a list of names after `update`. Example `$ update foo bar baz` will run updaters foo, bar and baz _in series_. The "next" updater always waits for the previous to finish.
* Updaters can have tasks, which are powered by [bach][] and use the same conventions as [gulp][]
* To run a task on an updater, do `$ update foo:abc`, where `abc` is the task name
* To run multiple tasks on an updater, do `$ update foo:abc,xyz`, where `abc` and `xyz` are task names
* Updaters that are published to npm can be [installed locally or globally](docs/installing-updaters.md)
* If you add an [updatefile.js](docs/updatefile.md) to the current working directory, Update's CLI will load it and register it as the ["default" updater](docs/updaters.md#default-updater).
* Update's CLI will look on the default updater for tasks and (other) updaters to run before looking elsewhere.

More [features](#features) listed below. See the [docs](docs) for more detail.

* [1 minute](#fast-track)
* [4 minutes](#getting-started)
* [???](docs)

## Fast track

Install `update` and the example "updater" with the following command:

```sh
$ npm install --global update updater-license
```

Make sure your work is committed, then run:

```sh
$ update license
```

## Getting started

This section just covers the essentials, more detail is [provided below](#table-of-contents) and in the [docs/](docs) folder.

**Installing Update**

To use the CLI, update must first be installed globally with [npm](https://www.npmjs.com/):

```sh
$ npm install --global update
```

This adds the `update` command to your system path, allowing it to be run from anywhere.

**Installing updaters**

To see how updaters work, install `updater-example`:

```sh
$ npm install --global updater-example
```

**Running updaters**

Add a file named `example.txt` to the current working directory, then run `updater-example` with the following command:

```sh
$ update example
```

Next, try the following steps to get familiarized with how update works:

* [ ] run `$ update example` to execute the default task, which will append the string `foo` to the file's contents.
* [ ] run `$ update example:foo` to execute the `foo` task, appending the string `foo` to the file's contents
* [ ] run `$ update example:bar` to execute the `bar` task, appending the string `bar` to the file's contents
* [ ] run `$ update example.abc` to execute the default task on the `abc` (sub-)updater, appending the string `abc:one` to the file's contents
* [ ] run `$ update example.abc:one` to execute the `one` task on the `abc` (sub-)updater, appending the string `abc:one` to the file's contents

**Init**

Now that you know how to run an updater directly, you can tell update to store a list of one or more updaters to run each time the `update` command is given:

```sh
$ update init
```

Whenever you install new updaters you can run `update init` to update your preferences.

Visit the [documentation](docs) for details about authoring an publishing updaters.

## Features

* **unparalleled flow control**: through the use of [updaters][getting-started], [sub-updaters][getting-started] and [tasks][getting-started]
* **templates, scaffolds and boilerplates**: update a single file, initialize an entire project, or provide ad-hoc "components" throughout the duration of a project using any combination of [templates, scaffolds and boilerplates](#templates-scaffolds-and-boilerplates).
* **any engine**: use any template engine to render templates, including [handlebars][], [lodash][], [swig][] and [pug][]
* **prompts**: asks you for data when it can't find what it needs, and it's easy to customize prompts for any data you want.
* **data**: gathers data from the user's environment to populate "hints" in user prompts and render templates
* **streams**: interact with the file system, with full support for [gulp][] and [assemble][] plugins
* **smart plugins**: Update is built on [base][], so any "smart" plugin can be used
* **stores**: persist configuration settings, global defaults, project-specific defaults, answers to prompts, and so on.

## Related projects

You might also be interested in these projects:

* [assemble](https://www.npmjs.com/package/assemble): Assemble is a powerful, extendable and easy to use static site generator for node.js. Used… [more](https://github.com/assemble/assemble) | [homepage](https://github.com/assemble/assemble "Assemble is a powerful, extendable and easy to use static site generator for node.js. Used by thousands of projects for much more than building websites, Assemble is also used for creating themes, scaffolds, boilerplates, e-books, UI components, API docum")
* [base](https://www.npmjs.com/package/base): base is the foundation for creating modular, unit testable and highly pluggable node.js applications, starting… [more](https://github.com/node-base/base) | [homepage](https://github.com/node-base/base "base is the foundation for creating modular, unit testable and highly pluggable node.js applications, starting with a handful of common methods, like `set`, `get`, `del` and `use`.")
* [generate](https://www.npmjs.com/package/generate): The Santa Claus machine for GitHub projects. Scaffolds out new projects, or creates any kind… [more](https://github.com/generate/generate) | [homepage](https://github.com/generate/generate "The Santa Claus machine for GitHub projects. Scaffolds out new projects, or creates any kind of required file or document from any given templates or source materials.")
* [verb](https://www.npmjs.com/package/verb): Documentation generator for GitHub projects. Verb is extremely powerful, easy to use, and is used… [more](https://github.com/verbose/verb) | [homepage](https://github.com/verbose/verb "Documentation generator for GitHub projects. Verb is extremely powerful, easy to use, and is used on hundreds of projects of all sizes to generate everything from API docs to readmes.")

## Contributing

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](../../issues/new).

Please read the [contributing guide](.github/contributing.md) for avice on opening issues, pull requests, and coding standards.

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
Released under the [MIT license](https://github.com/jonschlinkert/update/blob/master/LICENSE).

***

_This file was generated by [verb](https://github.com/verbose/verb), v0.9.0, on June 28, 2016._

[bach]: https://github.com/gulpjs/bach
[gulp]: http://gulpjs.com
[getting-started]: https://github.com/taunus/getting-started
[handlebars]: http://www.handlebarsjs.com/
[lodash]: https://lodash.com/
[swig]: https://github.com/paularmstrong/swig
[pug]: http://jade-lang.com
[assemble]: https://github.com/assemble/assemble
[base]: https://github.com/node-base/base