'use strict';

/**
 * Module dependencies
 */

var debug = require('debug')('update:plugin');
var path = require('path');
var gutil = require('gulp-util');
var through = require('through2');

/**
 * Local dependencies
 */

var normalize = require('./helpers/');

/**
 * virtually everything in this file is a temporary
 * hack until I get update-package straightened out.
 */

module.exports = function pkg_(verb) {
  debug('pkg plugin');

  return function() {
    return through.obj(function (file, enc, cb) {
      if (file.isNull() || !file.isBuffer() || path.basename(file.path) !== 'package.json') {
        this.push(file);
        return cb();
      }
      try {
        file = normalize(file, verb);
      } catch (err) {
        console.log(err);
        this.emit('error', new gutil.PluginError('update:pkg', err));
        return cb();
      }
      this.push(file);
      cb();
    });
  };
};
