'use strict';

var gutil = require('gulp-util');
var matter = require('gray-matter');
var through = require('through2');
var verbmd = require('../lib/verbmd');
var logger = require('../lib/logging');
var utils = require('../lib/utils');

module.exports = function(verb) {
  return function () {
    return through.obj(function (file, enc, cb) {
      if (file.isNull() || !file.isBuffer()) {
        this.push(file);
        return cb();
      }

      try {
        var stats = verb.get('stats');
        var str = file.contents.toString();
        var log = logger(str);

        var obj = matter(str);
        var keys = Object.keys(obj.data);

        if (keys.length && obj.data.hasOwnProperty('tags')) {
          str = obj.content.replace(/^\s+/, '');
          log.success(str, 'stripped deprecated front-matter tags in', file.relative);
        }

        str = verbmd(str, stats || {});
        log.success(str, 'updated helpers in', file.relative);
        file.contents = new Buffer(str);

      } catch (err) {
        console.log(err);
        this.emit('error', new gutil.PluginError('update:verbmd', err));
        return cb();
      }

      this.push(file);
      cb();
    });
  };
};
