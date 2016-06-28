# Introduction

- [What is update?](#what-is-update)
- [How does it work?](#how-does-it-work)
- [Updaters](#updaters)
- [Command line](#command-line)
  * [updatefile.js](#updatefilejs)
  * [Running updaters](#running-updaters)
  * [Aliases](#aliases)
- [Resolving updaters](#resolving-updaters)
- [API](#api)
- [Update](#update)

## What is update?

Update is a new, open-source developer framework for automating updates of any kind to code projects.

* update files that are typically excluded from the automated parts of the software lifecycle, and thus are mostly forgotten about after they're created.
* fix dates in copyrights, licenses and banners, removing deprecated fields from project manifests, updating settings in runtime config files, preferences in dotfiles, and so on.
* normalize configuration settings, verbiage, or preferences across all of your projects

## How does it work?

**Updaters**

All "updates" are accomplished using plugins called [updaters](#updaters). Updaters are functions that are registered by name, and can be run by [command line](#command-line) or [API](#api).

**Update core**

Update itself is system for [creating](#creating-updaters), [registering](#registering-updaters), [resolving](#resolving-updaters) and [running](#running-updaters) updaters.

## Updaters

**What are updaters?**

Updaters are plugins that provide all of the "updating" capabilities to update. Technically speaking, updaters are functions that are either registered by name using the [.register](#register) method, or directly using the [.use](#use) method.

Updaters may be published to [npm](https://www.npmjs.com) using the `updater-foo` naming convention, where `foo` is the [alias](#aliases) of your updater. Published updaters can be installed locally or globally.

1. **Plugins**:

Since updaters tend to be used on unstructured data, or things that are often updated "by hand", the first few times you run update (depending on the updaters you run) you might be suprised at the number of inconsistencies and errors that are uncovered.

## Command line

### updatefile.js

Each time `update` is run, Update's CLI looks for an [updatefile.js](docs/updatefile.md) in the current working directory:

**If `updatefile.js` exists**

If found, Update's CLI will attempt to load a local installation of the Update library using node's `require()` system, falling back to a global installation if necessary. Next, Update's CLI loads the configuration from your `updatefile.js`, and executes any tasks or updaters you've specified for it to run.

**If `updatefile.js` does not exist**

If not found, Update's CLI attempts to find any updaters you've specified for it to run by using node's `require()` system to search for locally installed modules with the name `updater-*`,

### Running updaters

To run updaters by command line, pass the [aliases](#aliases) or full [npm](https://www.npmjs.com) package names (if published) of the updaters to run after the `update` command.

**Example**

Run updaters `foo`, `bar` and `baz` in series:

```sh
$ update foo bar baz
# or
$ update updater-foo updater-bar updater-baz
```

Note that _updaters are run in series_, so given the previous example, updater `bar` will not run until updater `foo` is completely finished executing.

### Aliases

Get the alias of an updater by removing the `updater-` substring from the begining of the full name.

## Resolving updaters

When run by command line, Update's CLI will attempt to find and run updaters matching the names you've given, by first searching in the local `updatefile.js`, then using node's `require()` system to find locally installed updaters, and last by searching for globally installed updaters.

If any of the updaters specified is not found, _an error is thrown and the process will exit_.

## API

by passing the names of updaters to run to the `.update`

## Update

Updaters via CLI or API. (tasks are powered by [bach](https://github.com/gulpjs/bach), the same library used in [gulp](http://gulpjs.com) v4.0).

The main export of the library is a constructor function, `Update`.

Updaters themselves are just functions that take an instance of `Update`. wrap code to be executed when the

Update gives you a way to automate the maintenance of files that are typically excluded from the automated parts of the software lifecycle, and thus are mostly forgotten about after they're created.

For example, if we were to sift the files in the average code project into major generic buckets we would end up with something like this:

* **code**: the actual source code of the project (compiled, lib, src, and so on)
* **dist**: the "deliverable" of the project (this could be HTML, CSS, minified JavaScript, or something similar for non-web projects)
* **docs**: documentation for the project
* **everything else**: LICENSE and copyright files, dotfiles, manifests, config files, and so on.

Update maintains **everything else**.

true

**Docs**

* [updaters](updaters.md)
* [updatefile](updatefile.md)
* [tasks](tasks.md)
* [features](features.md)
* [faq](faq.md)
