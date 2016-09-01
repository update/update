---
title: Updatefile
related:
  doc: ['installing-updaters', 'updaters', 'tasks']
---

If you're authoring (and maybe even publishing) an updater, you can use the same conventions you would with any other node.js library. If node.js/npm can find your module, then so can Update. You can write your code in `index.js`, or `lib/foo.js` or wherever you want.

However, Update's CLI shows a little unfair favoratism for files with the name `updatefile.js`.

When the current working directory has an `updatefile.js`, Update's CLI will try to run any tasks or code in that file _instead of running your [default updaters](cli/built-in-tasks.md#init)_.

**Force default updaters to run**

You can force Update's CLI to run all of your default updaters by passing the `--run` flag on the command line, or to _always run default updaters in a project that has an `updatefile.js`, you can add the following in package.json:

```json
{
  "update": {
    "run": true
  }
}
```

Note that that this will run _both_ the default updaters, and the `updatefile.js`, in that order.

## How the CLI uses updatefile.js

Each time `update` is run, Update's CLI looks for an `updatefile.js` in the current working directory.

**If `updatefile.js` exists**

Update's CLI attempts to:

* Load a local installation of the Update library using node's `require()` system, falling back to global installation if not found.
* Load the configuration from `updatefile.js` using node.js `require()` system
* Register it as the ["default" updater](updaters.md#default-updater)
* Execute any tasks or updaters you've specified for it to run.
* If multiple task or updater names are specified on the command line, Update's CLI will attempt to run all of the specified tasks and updaters.

**If `updatefile.js` does not exist**

Update's CLI attempts to:

* Find any updaters you've specified for it to run by using node's `require()` system to search for locally and globally installed modules with the name `updater-*`.


## Creating an updatefile.js

An `updatefile.js` may contain any custom JavaScript code, but must export a function that takes an instance of Update (`app`):

**Example**

```js
// -- updatefile.js --
module.exports = function(app) {
  // custom code here
};
```

Inside this function, you can define [tasks](tasks.md), additional [updaters](updaters.md), or any other custom JavaScript code necessary for your updater:

```js
module.exports = function(app) {
  // register a task
  app.task('default', function(cb) {
    // do task stuff
    cb();
  });

  // register an updater
  app.register('foo', function() {

  });

  // register another updater
  app.register('bar', function() {

  });
};
```
