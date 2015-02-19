'use strict';

var through = require('through2');

module.exports = function verbfile() {
  var verb = this;

  return through.obj(function (file, enc, cb) {
    if (file.isNull() || !file.isBuffer()) {
      this.push(file);
      return cb();
    }
    var year = verb.get('data.copyright') || new Date().getFullYear();
    var str = verbfile(file.contents.toString(), year);
    file.contents = new Buffer(str);
    console.log('verbfile updated');
    this.push(file);
    cb();
  });
};
