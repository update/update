---
title: Updaters
related:
  doc: ['tasks', 'updatefile', 'installing-updaters']
---

Updaters are [plugins](api/plugins.md) that are registered by name. This document describes how to create, register and run updaters.

<!-- toc -->

## What is an updater?

Updaters are just plugins. The only difference between "updaters" and "plugins" is how they're registered.

**Comparison to plugins**

Here is a comparison to illustrate the differences between the two in detail:

|  | **Plugin** | **Updater** | 
| --- | --- | --- |
| Registered with | [.use](plugins.md#use) method | [.register](#register) method or [.updater](#updater) method |
| Instance | Loaded onto "current" `Update` instance | A `new Update()` instance is created for every updater registered |
| Invoked | Immediately | `.register` deferred (lazy), `.updater` immediately |
| Run using | [.run](plugins.md#run): all plugins are run at once | `.update`: only specified plugin(s) are run |

**Which method should I use?**

In general, it's recommended that you use the `.register` method. In most cases update is smart enough to figure out when to invoke updater functions.

However, there are always exceptions. If you create custom code and notice that update can't find the information it needs. Try using the `.updater` method to to invoke the function when the updater is registered.

## Creating updaters

An updater function takes an instance of `Update` as the first argument.

**Example**

```js
var update = require('update');
var app = update();

function updater(app) {
  console.log(app);
}
```

## Registering updaters

Updaters may be registered using either of the following methods:

* `.register`: if the plugin should not be invoked until it's called by `.update` (stays lazy while it's cached, this is preferred)
* `.updater`: if the plugin needs to be invoked immediately when registered

**Example**

```js
var Update = require('update');
var app = new Update();

function updater(msg) {
  return function(app) {
    // "app" is the instance of update we created
    console.log(msg);
  };
}

app.register('foo', updater('One!!!'));
app.updater('bar', updater('Two!!!')); // <= invoked now

// `updater` foo won't be invoked until called by `.update`
app.update(['foo', 'bar'], function(err) {
  if (err) return console.log(err);
  // 'One!!!'
  // 'Two!!!'
});
```

## Running updaters

Updaters and their tasks can be run by command line or API.

todo

## Resolving updaters

Updaters can be published to npm and installed globally or locally. But you there is no requirement that updaters must be published. You can also create custom updaters and register them using the [.register](#register) or [.updater](#updater) methods.

This provides a great deal of flexibility, but it also means that we need a strategy for _finding updaters_ when `update` is run from the command line.

### Tasks and updaters

1. When both a task and an updater have the same name _on the same instance_, Update will always try to run the task first (this is unlikely to happen unless you intend for it to - there are [reasons to do this](#naming-tips))

### Naming tips

Since the [.build](tasks.md#build) method only runs tasks, you can use this to your advantage by aliasing sub-generators with tasks.

**Don't do this**

```js
module.exports = function(app) {
  app.register('foo', function(foo) {
    foo.task('default', function(cb) {
      // do task stuff
      cb();
    });
  });

  // `.build` doesn't run updaters
  app.build('foo', function(err) {
    if (err) return console.log(err);
  });
};
```

**Do this**

```js
module.exports = function(app) {
  app.register('foo', function(foo) {
    foo.task('default', function(cb) {
      // do task stuff
      cb();
    });
  });

  // `.build` doesn't run updaters
  app.update('foo', function(err) {
    if (err) return console.log(err);
  });
};
```

**Or this**

```js
module.exports = function(app) {
  app.register('foo', function(foo) {
    foo.task('default', function(cb) {
      // do task stuff
      cb();
    });
  });

  app.task('foo', function(cb) {
    app.update('foo', cb);
  });

  // `.build` will run task `foo`, which runs the updater
  app.build('foo', function(err) {
    if (err) return console.log(err);
  });
};
```

### Order of precendence

When the command line is used, Update's CLI resolves updaters in the following order:

1. [default updater](#default-updater): attempts to match given names to updaters and tasks registered on the `default` updater
2. built-in updaters: attempts to match given names to Update's [built-in updaters](cli/built-in-updaters.md)
3. locally installed updaters
4. globally installed updaters

## Discovering updaters

todo

## Default updater

If an updater is registered with the name `default` it will receive special treatment from Update and Update's CLI. More specifically, when Update's CLI looks for updaters or tasks to run, it will search for them on the `default` updater first.

There is a catch...

**Registering the "default" updater**

_The only way to register a `default` updater is by creating an [updatefile.js](updatefile.md) in the current working directory._

When used by command line, Update's CLI will then use node's `require()` system to get the function exported by `updatefile.js` and use it as the `default` updater.