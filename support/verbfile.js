'use strict';

var path = require('path');
var drafts = require('gulp-drafts');
var reflinks = require('gulp-reflinks');
var format = require('gulp-format-md');
var del = require('delete');
var middleware = require('./lib/middleware');
var common = require('./lib/common');
var paths = require('./lib/paths');

module.exports = function(app) {
  app.use(middleware());
  app.use(common());

  app.task('clean', function(cb) {
    // del(paths.docs(), {force: true}, cb);
    cb()
  });

  console.log(paths.docs())
  app.task('docs', ['clean'], function(cb) {
    app.layouts('docs/layouts/*.md', {cwd: paths.cwd()});
    app.docs('docs/*.md', {cwd: paths.cwd(), layout: 'default'});

    return app.toStream('docs')
      .pipe(drafts())
      .pipe(app.renderFile('*'))
      // .pipe(reflinks())
      .pipe(format())
      .pipe(app.dest(paths.docs()));
  });

  app.task('default', ['docs']);
};
