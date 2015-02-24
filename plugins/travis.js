'use strict';

var through = require('through2');
var yaml = require('js-yaml');
var utils = require('../lib/utils');
var logger = require('../lib/logging');

module.exports = function travis(verb) {
  return function() {
    return through.obj(function (file, enc, cb) {
      if (file.isNull() || !file.isBuffer()) {
        this.push(file);
        return cb();
      }

      if (utils.contains(file.path, '.travis')) {
        var str = file.contents.toString();
        var log = logger({nocompare: true});
        var obj = yaml.load(str);

        file.contents = new Buffer(str);
        log.success(true, 'loaded data from', file.relative);
      }

      this.push(file);
      cb();
    });
  };
};
