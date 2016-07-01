# Register

Register an updater function by name. Similar to [.updater](updater.md) but does not invoke the updater function.

```js
app.register(name, fn);
```

**Params**

* `name` **{String}**: name of the updater to register
* `fn` **{Function}**: updater function

**Example**

```js
var Update = require('update');
var app = new Update();

// not invoked until called by `.update`
app.register('foo', function(app) {
  // do updater stuff
});

app.update('foo', function(err) {
  if (err) return console.log(err);
});
```

## Related

**API**

* [updater](updater.md)
* [plugins](plugins.md)
