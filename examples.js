'use strict';

var update = require('./');
var foo = update();
var bar = update();


foo.task('files', function (cb) {
  console.log('files');
  cb();
});

foo.task('run', function (cb) {
  bar.build(, cb);
  console.log('run');
  cb();
});

foo.task('dest', function (cb) {
  console.log('dest');
  cb();
});

app.task('default', ['files', 'run', 'dest']);

app.build('default', console.log);
