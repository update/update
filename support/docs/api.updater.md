---
title: Updater
related:
  cli: ['commands']
  api: ['register', 'plugins']
  doc: ['faq']
---

Register an updater function by name. Similar to [.register](register.md) but immediately invokes the updater function upon registering it.

```js
app.updater(name, fn);
```

**Params**

* `name` **{String}**: name of the updater to register
* `updater` **{Function}**: updater function

**Example**

```js
var Update = require('update');
var app = new Update();

// immediately invoked
app.updater('bar', function(app) {
  // do updater stuff
});

app.update('bar', function(err) {
  if (err) return console.log(err);
});
```
