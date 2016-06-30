# Installing the cli

To run update from the command line, you'll need to install Update's CLI globally first. You can do that now with the following command:

```sh
$ npm install --global update
```

This adds the `update` command to your system path, allowing it to be run from any directory.

You should now be able to use the `update` command to execute code in a local `updatefile.js` file, or to run any locally or globally installed updaters by their [aliases](tasks.md#alias-tasks) or full names.

**Init**

If it's your first time using update, run `update init` to set your global defaults.

**CLI help**

```
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

## Related

**Docs**

* [installing-updaters](installing-updaters.md)
