'use strict';

var gutil = require('gulp-util');
var through = require('through2');
var update = require('update-license');
var utils = require('../lib/utils');
var logger = require('../lib/logging');

module.exports = function license(verb) {
  return function() {
    return through.obj(function (file, enc, cb) {
      if (file.isNull() || !file.isBuffer()) {
        this.push(file);
        return cb();
      }

      try {
        if (utils.contains(file.path, 'LICENSE')) {
          var str = file.contents.toString();
          var log = logger(str);
          str = update(str);
          log.success(str, 'updated patterns in', file.relative);
          file.contents = new Buffer(str);
        }
      } catch (err) {
        console.log(err);
        this.emit('error', new gutil.PluginError('update:license', err));
        return cb();
      }

      this.push(file);
      cb();
    });
  };
};
