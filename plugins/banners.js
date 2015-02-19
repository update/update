'use strict';

var through = require('through2');
var banner = require('update-banner');

module.exports = function banners() {
  return through.obj(function (file, enc, cb) {
    if (file.isNull() || !file.isBuffer()) {
      this.push(file);
      return cb();
    }

    var str = banner(file.contents.toString());
    file.contents = new Buffer(str);
    console.log('banner updated in:', file.relative);
    this.push(file);
    cb();
  });
};
