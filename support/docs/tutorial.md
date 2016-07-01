---
title: Tutorial
draft: true
related:
  doc: []
---

The following intro only skims the surface of what update has to offer. For a more in-depth introduction, we highly recommend visiting the [getting started guide][getting-started].

**Create an updater**

Add a `updatefile.js` to the current working directory with the following code:

```js
module.exports = function(app) {
  console.log('success!');
};
```

**Run an updater**

Enter the following command:

```sh
update
```

If successful, you should see `success!` in the terminal.

**Create a task**

Now, add a task to your updater.

```js
module.exports = function(app) {
  app.task('default', function(cb) {
    console.log('success!');
    cb();
  });
};
```

Now, in the command line, run:

```sh
$ update
# then try
$ update default
```

When a local `updatefile.js` exists, the `update` command is aliased to automatically run the `default` task if one exists. But you can also run the task with `update default`.

**Run a task**

Let's try adding more tasks to your updater:

```js
module.exports = function(app) {
  app.task('default', function(cb) {
    console.log('default > success!');
    cb();
  });

  app.task('foo', function(cb) {
    console.log('foo > success!');
    cb();
  });

  app.task('bar', function(cb) {
    console.log('bar > success!');
    cb();
  });
};
```

Now, in the command line, run:

```sh
$ update
# then try
$ update foo
# then try
$ update foo bar
```

**Run task dependencies**

Now update your code to the following:

```js
module.exports = function(app) {
  app.task('default', ['foo', 'bar']);

  app.task('foo', function(cb) {
    console.log('foo > success!');
    cb();
  });

  app.task('bar', function(cb) {
    console.log('bar > success!');
    cb();
  });
};
```

And run:

```sh
$ update
```

You're now a master at running tasks with update! You can do anything with update tasks that you can do with [gulp][] tasks (we use and support gulp libraries after all!).

**Next steps**

Update does much more than this. For a more in-depth introduction, we highly recommend visiting the [getting started guide](https://github.com/update/getting-started).