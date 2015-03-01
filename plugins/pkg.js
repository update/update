'use strict';

/**
 * Module dependencies
 */

var path = require('path');
var diff = require('arr-diff');
var gutil = require('gulp-util');
var omitEmpty = require('omit-empty');
var through = require('through2');
var update = require('update-package');

/**
 * Local dependencies
 */

var normalize = require('./helpers');

/**
 * virtually everything in this file is a temporary
 * hack until I get update-package straightened out.
 */

module.exports = function(verb) {
  return function() {
    return through.obj(function (file, enc, cb) {
      if (file.isNull() || !file.isBuffer() || path.basename(file.path) !== 'package.json') {
        this.push(file);
        return cb();
      }

      try {
        if (verb.exists('package.json')) {
          file = normalize(file, verb);
        }

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
