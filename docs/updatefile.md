# Updatefile

If an `updatefile.js` exists in the current working directoy, Update's CLI will attempt to load it and run any updaters or tasks you've specified for it to run.

Moreover, Update's CLI will use `updatefile.js` to create the ["default" updater](updaters.md#default-updater).

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

true

**Docs**

* [installing-updaters](installing-updaters.md)
* [updaters](updaters.md)
* [tasks](tasks.md)
