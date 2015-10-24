'use strict';

var through = require('through2');
var update = require('./');
var del = require('del');
var app = update()
  .use(require('./pipeline'))

app.plugin('a', require('./lib/pipeline/a')());
app.plugin('b', require('./lib/pipeline/b'));
app.plugin('c', require('./lib/pipeline/c')());
// app.plugin(/foo/, require('./lib/pipeline/d')());

app.disable('plugin.c');

app.task('default', function (cb) {
  app.src('*')
    .on('error', console.log)
    .pipe(through.obj(function (file, enc, next) {
      if (file.isNull()) return next();
      next(null, file);
    }))
    .pipe(app.pipeline())
    .pipe(app.dest('actual'))
    .on('finish', cb);
});

app.build('default', function(err) {
  if (err) return console.log(err);
});
