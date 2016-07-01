---
title: Plugins
related:
  api: ['updater', 'register']
  doc: []
---

A plugin is function that takes an instance of `Update` and is registered with the `.use` method. See the [base-plugins][] documentation for additional details.

### .use

The `.use` method is used for registering plugins that should be immediately invoked.

**Example**

```js
var Update = require('update');
var app = new Update();

function plugin(app) {
  // "app" and "this" both expose the instance of update we created above
}

app.use(plugin);
```

Once a plugin is invoked, it will not be called again.

### .run

If a plugin returns a function after it's invoked by `.use`, the function will be pushed onto an array allowing it to be called again by the `.run` method.

**Example**

```js
var Update = require('update');
var app = new Update();

function plugin(app) {
  // "app" and "this" both expose the instance of update we created above
  return plugin;
}

app.use(plugin);
```

We can now run all plugins that were pushed onto the `.fns` array on any arbitrary object:

```js
var obj = {};
app.run(obj);
```

Additionally:

* If `obj` has a `.use` method, it will be used on each plugin (e.g. `obj.use(fn)`). Otherwise `fn(obj)`.
* If the plugin returns a function again and `obj` has a `.run` method, the plugin will be pushed onto the `obj.fns` array.

This can continue indefinitely as long as the plugin returns a function and the receiving object has `.use`/`.run` functions.

## Updaters

When plugins are [registered by name](docs/updaters.md), they are referred to as "updaters". See the [updater documentation](docs/updaters.md) for more details.
