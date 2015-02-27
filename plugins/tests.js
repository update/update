'use strict';

var gutil = require('gulp-util');
var through = require('through2');
var regex = require('requires-regex');
var logger = require('../lib/logging');
var tests = require('../lib/tests');
var utils = require('../lib/utils');

module.exports = function(verb) {
  return function() {
    return through.obj(function (file, enc, cb) {
      if (file.isNull() || !file.isBuffer()) {
        this.push(file);
        return cb();
      }

      try {
        if (utils.contains(file.path, 'test')) {
          var str = file.contents.toString();
          var log = logger(str);

          // test.js is at the root, let's make sure
          // the path to `index.js` is correct
          if (file.path.indexOf('test/') === -1) {
            str.replace(regex(), function ($1, $2, $3, fp) {
              if (fp && fp === '../' || fp === '..') {
                str = str.replace(fp, './');
              }
            });
          }

          var hasShould = /['"]should/.test(str);
          verb.set('data.hasShould', hasShould);

          var deps = verb.env.devDependencies;

          // `should` exists in test files
          if (hasShould && deps) {
            str = tests.fixShould(str, file.relative);
            if (!deps.hasOwnProperty('should')) {
              // TODO: add should to deps if exists in tets
              // console.log(verb.env);
            }

            log.success(str, 'updated "should" statements in', file.relative);
          } else if (deps && deps.hasOwnProperty('should')) {
            verb.set('strip.pkg.devDependencies', 'should');
          }

          file.contents = new Buffer(str);
        }
      } catch (err) {
        console.log(err);
        this.emit('error', new gutil.PluginError('update:tests', err));
        return cb();
      }
      this.push(file);
      cb();
    });
  };
};
