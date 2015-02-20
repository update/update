'use strict';

var through = require('through2');
var utils = require('../lib/utils');
var logger = require('../lib/logging');

module.exports = function dotfilesPlugin() {
  return through.obj(function (file, enc, cb) {
    if (file.isNull() || !file.isBuffer()) {
      this.push(file);
      return cb();
    }

    var str = file.contents.toString();
    console.log(str)
    var log = logger(str);

    // if (utils.contains(file, '.gitattributes')) {
    //   str = '*.* text';
    //   log.success(str, 'updated patterns in', file.relative);
    // }

    file.contents = new Buffer(str);
    this.push(file);
    cb();
  });
};
