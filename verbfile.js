'use strict';

var del = require('del');
var path = require('path');
var verb = require('verb');
var log = require('./lib/logging')({nocompare: true});
var plugins = require('./plugins')(verb);
var parse = require('parse-copyright');

verb.onLoad(/./, function (file, next) {
  file.render = false;
  file.readme = false;
  next();
});

verb.onLoad(/\.js$/, function (file, next) {
  file.data.copyright = parse(file.content);
  next();
});

// verb.onLoad(/\.js/, function copyright(file, next) {
//   try {
//     if (typeof file.data.copyright === 'undefined') {
//       file.data.copyright = parse(file.content);
//     }
//   } catch (err) {
//     throw new Error('copyright middleware:', err);
//   }
//   next();
// });
// var parse = require('parse-copyright');



verb.copy('.verbrc.md', function (file) {
  file.path = '.verb.md';
  log.success('renamed', file.relative);
  return path.dirname(file.relative);
});

verb.copy('LICENSE-MIT', function (file) {
  file.path = 'LICENSE';
  log.success('renamed', file.relative);
  return path.dirname(file.relative);
});

verb.task('banners', function () {
  verb.src(['*.js', 'test/*.js', 'lib/*.js'], {render: false})
    .pipe(plugins.tests())
    .pipe(plugins.banners())
    .pipe(verb.dest(function (file) {
      return path.dirname(file.path);
    }));
});

verb.task('verbfile', function () {
  verb.src(['.verb{,rc}.md'], {render: false})
    .pipe(plugins.verbmd())
    .pipe(verb.dest(function (file) {
      file.path = '.verb.md';
      return path.dirname(file.path);
    }));
});

verb.task('jshint', function () {
  verb.src('.jshintrc', {render: false})
    .pipe(plugins.jshint())
    .pipe(verb.dest(function (file) {
      file.path = '.jshintrc';
      return path.dirname(file.path);
    }));
});

verb.task('dotfiles', function () {
  verb.src('.git*', {render: false, dot: true})
    .pipe(plugins.dotfiles())
    .pipe(verb.dest(function (file) {
      return path.dirname(file.path);
    }))
    .on('end', function (cb) {
      var files = ['.npmignore', 'test/mocha.opts', '.verbrc.md', 'LICENSE-MIT'];
      log.info('deleted', files.join(', '));
      del(files, cb);
    });
});

verb.task('pkg', function () {
  verb.src('package.json', {render: false})
    .pipe(plugins.pkg())
    .pipe(verb.dest('.'));
});

verb.task('readme', function () {
  verb.src('.verb.md')
    .pipe(verb.dest('.'));
});

verb.task('default', [
  'banners',
  'verbfile',
  'dotfiles',
  'jshint',
  'pkg',
  'readme'
]);

verb.run();
