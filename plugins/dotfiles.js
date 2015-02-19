'use strict';

var through = require('through2');
var utils = require('../lib/utils');

module.exports = function dotfiles() {
  return through.obj(function (file, enc, cb) {
    if (file.isNull() || !file.isBuffer()) {
      this.push(file);
      return cb();
    }

    var str = file.contents.toString();
    if (utils.contains(file, '.gitattributes')) {
      str = '*.* text';
    }

    file.contents = new Buffer(str);
    console.log('dotfiles updated');
    this.push(file);
    cb();
  });
};
