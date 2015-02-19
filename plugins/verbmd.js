'use strict';

var matter = require('gray-matter');
var through = require('through2');
var verbmd = require('../lib/verbmd');
var logger = require('../lib/logging');

module.exports = function verbmdPlugin(verb) {
  return function () {
    return through.obj(function (file, enc, cb) {
      if (file.isNull() || !file.isBuffer()) {
        this.push(file);
        return cb();
      }

      if (file.path.indexOf('verbfile')) {
        var str = file.contents.toString();
        var log = logger(str);

        var obj = matter(str);
        var keys = Object.keys(obj.data);

        if (keys.length && obj.data.hasOwnProperty('tags')) {
          str = obj.content.replace(/^\s+/, '');
          log.success(str, 'stripped front-matter in', file.relative);
        }

        str = verbmd(str);

        log.success(str, 'updated helpers in', file.relative);
        file.contents = new Buffer(str);
      }

      this.push(file);
      cb();
    });
  };
};
