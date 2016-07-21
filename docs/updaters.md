# Updaters

This document describes how to create, register and run updaters.

- [TODO](#todo)
- [What is an updater?](#what-is-an-updater)
- [Creating updaters](#creating-updaters)
- [Registering updaters](#registering-updaters)
  * [.register](#register)
  * [.updater](#updater)
- [Running updaters](#running-updaters)
- [Resolving updaters](#resolving-updaters)
  * [Tasks and updaters](#tasks-and-updaters)
  * [Naming tips](#naming-tips)
  * [Order of precendence](#order-of-precendence)
- [Discovering updaters](#discovering-updaters)
- [Default updater](#default-updater)

## TODO

* [ ] document updater args
* [ ] explain how the `base` instance works
* [ ] document `env`

## What is an updater?

Updaters are [plugins](api/plugins.md) that are registered by name. If you're not familiar with plugins yet, it might be a good idea to review the [plugins docs](api/plugins.md) first.

The primary difference between "updaters" and "plugins" is how they're registered, but there are a few other minor differences:

|  | **Plugin** | **Updater** | 
| --- | --- | --- |
| Registered with | [.use](api/plugins.md#use) method | [.register](#register) method or [.updater](#updater) method |
| Instance | Loaded onto "current" `Update` instance | A `new Update()` instance is created for every updater registered |
| Invoked | Immediately | `.register` deferred (lazy), `.updater` immediately |
| Run using | [.run](api/plugins.md#run): all plugins are run at once | `.update`: only specified plugin(s) are run |

## Creating updaters

An updater function takes an instance of `Update` as the first argument.

**Example**

```js
function updater(app) {
  // do updater stuff
}
```

## Registering updaters

Updaters may be registered using either of the following methods:

* `.register`: if the plugin should not be invoked until it's called by `.update` (stays lazy while it's cached, this is preferred)
* `.updater`: if the plugin needs to be invoked immediately when registered

### .register

Register an updater function with the given `name` using the `.register` method.

**Example**

```js
var update = require('update');
var app = update();

function updater(app) {
  // do updater stuff when the updater is run with the `.update` method.
  console.log('foo is being run');
}

// register as an updater with the `.register` method
app.register('foo', updater);

// run the `foo` updater with the `.update` method
app.update('foo', function(err) {
  if (err) return console.log(err);
});
//=> "foo is being run"
```

### .updater

Register an updater function with the given `name` using the `.updater` method.

**Example**

```js
var update = require('update');
var app = update();

function updater(app) {
  // do updater stuff when the updater is registered
  console.log('foo is being registered');
}

// register as an updater using `.updater`
app.updater('foo', updater);
//=> "foo is being registered"
```

**Should I use `.updater` or `.register`?**

In general, it's recommended that you use the `.register` method. In most cases update is smart enough to figure out when to invoke updater functions.

However, there are always exceptions. If you create custom code and notice that update can't find the information it needs. Try using the `.updater` method to invoke the function when the updater is registered.

## Running updaters

Updaters and their tasks can be run by command line or API.

**Command line**

To run globally or locally installed `updater-foo`, or an updater named `foo` in `updatefile.js`, run:

```sh
$ update foo
```

**API**

```js
var update = require('update');
var app = update();

function fn() {
  // do updater stuff
}

// the `.register` method does not invoke the updater
app.register('foo', fn);

// the `.updater` method invokes the updater immediately
app.updater('bar', fn);

// run updaters foo and bar in series (both updaters will be invoked)
app.update(['foo', 'bar'], function(err) {
  if (err) return console.log(err);
});
```

## Resolving updaters

Updaters can be published to npm and installed globally or locally. But there is no requirement that updaters must be published. You can also create custom updaters and register using the [.register](#register) or [.updater](#updater) methods.

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

  // `.update` will run updater `foo`
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

  // `.build` will run task `foo`, which runs updater `foo`
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

## Related

**Docs**

* [tasks](tasks.md)
* [updatefile](updatefile.md)
* [installing-updaters](installing-updaters.md)
* [symlinking-updaters](symlinking-updaters.md)
