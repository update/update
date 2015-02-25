'use strict';

var fs = require('fs');
var del = require('del');
var path = require('path');
var verb = require('verb');
var parse = require('parse-copyright');
var log = require('./lib/logging')({nocompare: true});
var plugins = require('./plugins')(verb);
var utils = require('./lib/utils');
var glob = require('glob');

function tryReaddir(fp) {
  try {
    return fs.readdirSync(fp);
  } catch (err) {}
  return [];
}

// verb.known(function(env) {
//   var orgs = ['jonschlinkert', 'doowb', 'assemble', 'verb', 'helpers', 'regexps'];
//   var repo = env.repository;
//   if (typeof repo === 'object') {
//     repo = repo.url;
//   }
//   var len = orgs.length;
//   while(len--) {
//     var ele = orgs[len];
//     if (repo.indexOf(ele) !== -1) {
//       return true;
//     }
//   }
//   return false;
// });

verb.onLoad(/./, function (file, next) {
  var files = tryReaddir(process.cwd());
  var tests = [];

  if (files.indexOf('test') !== -1) {
    tests = tryReaddir(process.cwd() + '/test');
  }

  verb.set('stats.files', files.concat(tests || []));
  verb.set('stats.hasTravis', fs.existsSync('.travis.yml'));
  verb.match = utils.match(files);

  file.render = false;
  file.readme = false;
  next();
});

verb.onLoad(/\.js$/, function (file, next) {
  file.data.copyright = parse(file.content);
  next();
});

verb.copy('.verbrc.md', function (file) {
  file.path = '.verb.md';
  log.success('renamed', file.relative);
  return path.dirname(file.relative);
});

var files = glob.sync('test/**').filter(function (fp) {
  return fs.statSync(fp).isDirectory();
});

var singleTest = false;
if (files && files.length === 1) {
  singleTest = true;
  verb.set('singleTest', true);
  verb.copy('test/test.js', function (file) {
    file.path = 'test.js';
    log.success('moved', file.path);
    return file.base;
  });
}

verb.copy('LICENSE-MIT', function (file) {
  file.path = 'LICENSE';
  log.success('renamed', file.relative);
  return path.dirname(file.relative);
});

verb.task('banners', function () {
  verb.src(['*.js', 'test/*.js', 'lib/*.js'], {render: false})
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

verb.task('travis', function () {
  verb.src('.travis.yml', {render: false})
    .pipe(plugins.travis())
    .pipe(verb.dest(function (file) {
      file.path = '.travis.yml';
      return path.dirname(file.path);
    }));
});

verb.task('tests', function () {
  verb.src(['test.js', 'test/*.js'], {render: false})
    .pipe(plugins.tests())
    .pipe(verb.dest(function (file) {
      return path.dirname(file.path);
    }));
});

verb.task('license', function () {
  verb.src('LICENSE{,-MIT}', {render: false})
    .pipe(plugins.license())
    .pipe(verb.dest(function (file) {
      file.path = 'LICENSE';
      return path.dirname(file.path);
    }));
});

verb.task('dotfiles', function () {
  verb.src('.git*', {render: false, dot: true})
    .pipe(plugins.editorconfig())
    .pipe(plugins.gitignore())
    .pipe(verb.dest(function (file) {
      return path.dirname(file.path);
    }))
    .on('end', function (cb) {
      var files = ['.npmignore', 'test/mocha.opts', '.verbrc.md', 'LICENSE-MIT'];
      var res = utils.exists(files);

      var exists = res.EXISTS;
      if (verb.get('singleTest')) {
        exists.push('test');
      }

      if (exists.length) {
        del(exists, cb);
        log.info('deleted', exists.join(', '));
      }
    });
});

verb.task('pkg', function () {
  verb.src('package.json', {render: false})
    .pipe(plugins.pkg())
    .pipe(verb.dest('.'));
});

verb.task('readme', function () {
  verb.src('.verb.md')
    .pipe(verb.dest('.'))
    .on('end', function (cb) {
      log.success(true, 'updated.');
    });
});

verb.task('default', [
  'tests',
  'banners',
  'verbfile',
  'dotfiles',
  'travis',
  'jshint',
  'license',
  'pkg',
  'readme'
]);
verb.diff()
verb.run();
