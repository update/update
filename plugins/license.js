'use strict';

var debug = require('debug')('update:plugin');
var gutil = require('gulp-util');
var through = require('through2');
var license = require('update-license');
// var utils = require('../lib/utils');
// var logger = require('../lib/logging');

module.exports = function license_(verb) {
  debug('license plugin');
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
          str = license(str);
          log.success(str, 'updated patterns in', file.relative);
          file.contents = new Buffer(str);
        }
      } catch (err) {
        console.log(err);
        this.emit('error', new gutil.PluginError('[update] license plugin:', err));
        return cb();
      }

      this.push(file);
      cb();
    });
  };
};
