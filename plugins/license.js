'use strict';

var through = require('through2');
var update = require('update-license');
var utils = require('../lib/utils');
var logger = require('../lib/logging');

module.exports = function license() {
  return through.obj(function (file, enc, cb) {
    if (file.isNull() || !file.isBuffer()) {
      this.push(file);
      return cb();
    }

    var str = file.contents.toString();
    var log = logger(str);

    if (utils.contains(file, 'LICENSE')) {
      str = update(str);
      log.success(str, 'updated patterns in', file.relative);
    }

    file.contents = new Buffer(str);
    this.push(file);
    cb();
  });
};
