'use strict';

/**
 * Module dependencies
 */

var gutil = require('gulp-util');
var through = require('through2');
var sync = require('sync-pkg');

module.exports = function bower_(verb) {
  return function() {
    return through.obj(function (file, enc, cb) {
      this.push(file);
      return cb();
    }, function (cb) {
      var file = new gutil.File({path: 'bower.json'});
      var data = JSON.stringify(sync(verb.env), null, 2);

      file.contents = new Buffer(data);
      this.push(file);
      cb();
    });
  };
};
