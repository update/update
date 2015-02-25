'use strict';

var gutil = require('gulp-util');
var through = require('through2');
var utils = require('../lib/utils');
var logger = require('../lib/logging');

module.exports = function(verb) {
  return function() {
    return through.obj(function (file, enc, cb) {
      if (file.isNull() || !file.isBuffer()) {
        this.push(file);
        return cb();
      }

      try {

        if (utils.contains(file.path, '.gitattributes')) {
          var str = file.contents.toString();
          var log = logger(str);

          str = [
            '# Enforce Unix newlines',
            '* text eol=lf',
            '',
            '# binaries',
            '*.ai binary',
            '*.psd binary',
            '*.jpg binary',
            '*.gif binary',
            '*.png binary',
            '*.jpeg binary'
          ].join('\n');

          log.success(str, 'updated patterns in', file.relative);
          file.contents = new Buffer(str);
        }

      } catch (err) {
        this.emit('error', new gutil.PluginError('update:dotfiles', err));
        return cb();
      }


      this.push(file);
      cb();
    });
  };
};

