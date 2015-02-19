'use strict';

var through = require('through2');
var verbfile = require('../lib/verbfile-fixes');

module.exports = function(verb) {
  return function () {
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
};
