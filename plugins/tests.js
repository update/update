'use strict';

var through = require('through2');
var logger = require('../lib/logging');

module.exports = function testsPlugin() {
  return through.obj(function (file, enc, cb) {
    if (file.isNull() || !file.isBuffer()) {
      this.push(file);
      return cb();
    }

    var str = file.contents.toString();
    var log = logger(str);

    if (str.indexOf('var should') !== -1) {
      str = fixShould(str, file.relative);
      log.success(str, 'updated "should" statements in', file.relative);
    }

    file.contents = new Buffer(str);
    this.push(file);
    cb();
  });
};

function fixShould(str) {
  var segs = str.split('var should = require(\'should\');');
  str = segs.join('require(\'should\');');
  return str;
}
