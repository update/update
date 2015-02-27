'use strict';

var gutil = require('gulp-util');
var difference = require('arr-diff');
var through = require('through2');
var utils = require('../lib/utils');
var logger = require('../lib/logging');

module.exports = function gitignore(verb) {
  return function() {
    return through.obj(function (file, enc, cb) {
      if (file.isNull() || !file.isBuffer()) {
        this.push(file);
        return cb();
      }

      try {
        if (utils.contains(file.path, '.gitignore')) {
          // just get these started
          var patterns = ['*.DS_Store'];
          var str = file.contents.toString();
          var log = logger(str);

          var lines = str.split('\n').map(trim);
          var diff = difference(patterns, lines);

          if (lines[0].charAt(0) === '#') {
            var comment = lines.slice(0, 1);
            var rest = lines.slice(1);
            lines = comment.concat(diff).concat(rest);
          } else {
            lines = diff.concat(lines);
          }

          str = lines.join('\n');
          log.success(str, 'updated patterns in', file.relative);
          file.contents = new Buffer(str);
        }
      } catch (err) {
        this.emit('error', new gutil.PluginError('update:gitignore', err));
        return cb();
      }

      this.push(file);
      cb();
    });
  };
};


function trim(str) {
  return str.trim();
}
