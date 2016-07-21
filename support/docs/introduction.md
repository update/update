---
title: Introduction
draft: true
related:
  doc: ['updaters', 'updatefile', 'tasks', 'features', 'faq']
---

<!-- toc -->

## What is update?

Update is a new, open-source developer framework for automating updates of any kind in code projects.

* normalize configuration settings, verbiage, or preferences across all of your projects
* update files that are typically excluded from the automated parts of the software lifecycle, and are often forgotten about after they're created.
* fix dates in copyrights, licenses and banners
* removing deprecated fields from project manifests
* updating settings in runtime config files, preferences in dotfiles, and so on.

## How does it work?

Update's API has methods for [creating](#creating-updaters), [registering](#registering-updaters), [resolving](#resolving-updaters) and [running](#running-updaters) updaters.

### Who should use Update?

* developers or organizations with many projects under their stewardship
* agencies or consultants who maintain and/or create client projects and would like to reduce time spent on maintainance
* anyone who cares about having consistency across all of their projects

## Updaters

All "updates" are accomplished using plugins called [updaters](#updaters).

**What are updaters?**

- Updaters are functions that are registered by name, and can be run by [command line](#command-line) or [API](#api).
- Updaters may be published to [npm](https://www.npmjs.com) using the `updater-foo` naming convention, where `foo` is the [alias](#aliases) of your updater.
- Published updaters can be installed locally or globally.

## Command line

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

Updaters via CLI or API. (tasks are powered by [bach][], the same library used in [gulp][] v4.0).

The main export of the library is the `Update` constructor function.

Updaters themselves are just functions that take an instance of `Update`.

Update gives you a way to automate the maintenance of files that are typically excluded from the automated parts of the software lifecycle, and thus are mostly forgotten about after they're created.

For example, if we were to sift the files in the average code project into major generic buckets we would end up with something like this:

* **code**: the actual source code of the project (compiled, lib, src, and so on)
* **dist**: the "deliverable" of the project (this could be HTML, CSS, minified JavaScript, or something similar for non-web projects)
* **docs**: documentation for the project
* **everything else**: LICENSE and copyright files, dotfiles, manifests, config files, and so on.

Update maintains **everything else**.
