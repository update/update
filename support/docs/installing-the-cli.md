---
title: Installing the cli
related:
  doc: ['installing-updaters']
---

To run update from the command line, you'll need to install Update's CLI globally first. You can do that now with the following command:

```sh
$ npm install --global update
```

This adds the `update` command to your system path, allowing it to be run from any directory.

You should now be able to use the `update` command to execute code in a local `updatefile.js` file, or to run any locally or globally installed updaters by their [aliases](tasks.md#alias-tasks) or full names.
