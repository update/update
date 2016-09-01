---
title: Command line flags
related:
  docs: ['']
---

Supported command line flags.

## --run

By default, when an `updatefile.js` exists in the current working directory, the `update` command will only run explicitly specified tasks or, if no tasks are explicitly defined, the `default` task in `updatefile.js`.

The `--run` flag forces `update` to run stored tasks and the `default` task or explicitly specified tasks in `updatefile.js`. Stored tasks are executed first, in the order defined, then the `default` task or explicitly defined tasks.

**Example**

```sh
$ update --run
```

## --help

See a help menu in the terminal:

```sh
Usage: update <command> [options]

Command: Updater or tasks to run

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

