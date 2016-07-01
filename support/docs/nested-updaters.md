---
title: Nested updaters
---

Updaters provide a convenient way of wrapping code that should be executed on-demand, whilst also "namespacing" the code being wrapped, and making it available to be executed using a consistent and intuitive syntax by either CLI or API.


TBC...


## TODO

- [ ] explain how nested updaters work
- [ ] command line syntax
- [ ] API syntax

## Pre-requisites

- [plugins](api/plugins.md)
- [updaters](updaters.md)

## Sub-updaters

As with [plugins](api/plugins.md), updaters may be nested: _any updater can register other updaters, and any updater can be registered by other updaters._ We refer to nested updaters as **sub-updaters**.

**Example**

```js
app.register('foo', function(foo) {
  // do updater stuff
  this.register('bar', function(bar) {
    // do updater stuff
    this.register('baz', function(baz) {
      // do updater stuff
      this.task('default', function(cb) {
        console.log(baz.namespace);
        cb();
      });
    });
  });
});
```

## Run nested updaters

Use dot-notation to get the updater you wish to run:

```js
app.update('foo.bar.baz', function(err) {
  if (err) return console.log(err);

});
```
