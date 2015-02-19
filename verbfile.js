'use strict';

var fs = require('fs');
var del = require('del');
var path = require('path');
var verb = require('verb');
var dest = require('gulp-dest');
var rename = require('./lib/rename');
var update = require('./lib/plugins')(verb);

verb.onLoad(/\.verbrc\.md/, function (file, next) {
  update.getCopyright('index.js');
  file.render = false;
  file.readme = false;
  next();
});

verb.copy('.verbrc.md', function (file) {
  file.path = '.verb.md';
  console.log('renamed .verb.md');
  return path.dirname(file.relative);
});

verb.copy('LICENSE-MIT', function (file) {
  file.path = 'LICENSE';
  console.log('renamed LICENSE');
  return path.dirname(file.relative);
});

verb.task('banners', function () {
  verb.src(['*.js', 'test/*.js', 'lib/*.js'], {render: false})
    .pipe(update.banners())
    .pipe(verb.dest(function (file) {
      return path.dirname(file.path);
    }));
});

verb.task('verbfile', function () {
  verb.src(['.verb{,rc}.md'], {render: false})
    .pipe(update.verbfile())
    .pipe(verb.dest(function (file) {
      file.path = '.verb.md';
      return path.dirname(file.path);
    }));
});

verb.task('jshint', function () {
  verb.src('.jshintrc', {render: false})
    .pipe(update.jshint())
    .pipe(verb.dest(function (file) {
      file.path = '.jshintrc';
      return path.dirname(file.path);
    }));
});

verb.task('dotfiles', function () {
  verb.src('.git*', {render: false, dot: true})
    .pipe(update.dotfiles())
    .pipe(verb.dest(function (file) {
      return path.dirname(file.path);
    }))
    .on('end', function (cb) {
      console.log('deleting junk...');
      del(['.npmignore', 'test/mocha.opts', '.verbrc.md', 'LICENSE-MIT'], cb);
    });
});

verb.task('readme', function () {
  verb.src('.verb.md')
    .pipe(verb.dest('.'))
});

verb.task('default', [
  'banners',
  'verbfile',
  'dotfiles',
  'jshint',
  'readme'
]);


verb.run();
