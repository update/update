# Create an updater

> Updaters follow the same signature as gulp plugins

**Example**

```js
function foo(options) {
  return through.obj(function (file, enc, cb) {
    var str = file.contents.toString();
    // do stuff
    file.contents = new Buffer(file.contents);
    this.push(file);
    cb();
  });
}
```

## Publish your updater

1. Name your project following the convention: `updater-*`
2. Don't use dots in the name (e.g `.js`) 
3. Make sure you add `updater` to the keywords in package.json
4. Tweet about your updater!