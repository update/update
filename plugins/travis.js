'use strict';

var through = require('through2');
var yaml = require('js-yaml');
var utils = require('../lib/utils');
var logger = require('../lib/logging');

module.exports = function (verb) {
  return function travis() {
    return through.obj(function (file, enc, cb) {
      if (file.isNull() || !file.isBuffer()) {
        this.push(file);
        return cb();
      }

      if (utils.contains(file, '.travis.yml')) {
        var str = file.contents.toString();
        var log = logger(str);
        var obj = yaml.load(str);
        // console.log(verb.cache.data);

        // log.success(str, 'updated patterns in', file.relative);
      }

      // file.contents = new Buffer(str);
      this.push(file);
      cb();
    });
  };
};
