'use strict';

var through = require('through2');

module.exports = function(options) {
  console.log(this)
  return through.obj(function (file, enc, cb) {
    console.log(file)
    var str = file.contents.toString();
    str += 'aaa\n';

    file.contents = new Buffer(str);
    this.push(file);
    cb();
  });
};
