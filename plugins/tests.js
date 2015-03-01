'use strict';

var gutil = require('gulp-util');
var through = require('through2');
var logger = require('../lib/logging');
var should = require('../lib/tests/should');
var paths = require('../lib/tests/paths');
var utils = require('../lib/utils');

module.exports = function (verb) {
  return function () {
    return through.obj(function (file, enc, cb) {
      if (file.isNull() || !file.isBuffer()) {
        this.push(file);
        return cb();
      }

      try {
        if (verb.file('test')) {
          // fix `should` related info
          file = should(file, verb);

          // fix paths
          file = paths(file, verb);
        }

      } catch (err) {
        console.error('update:tests', err);
        this.emit('error', new gutil.PluginError('update:tests', err));
        return cb();
      }
      this.push(file);
      cb();
    });
  };
};
