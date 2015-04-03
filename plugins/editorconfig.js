'use strict';

var debug = require('debug')('update:plugin');
var gutil = require('gulp-util');
var through = require('through2');
// var ec = require('editorconfig');

module.exports = function editorconfig_(verb) {
  debug('editorconfig plugin');
  return function() {
    return through.obj(function (file, enc, cb) {
      this.push(file);
      cb();
    }, function (cb) {
      var file = new gutil.File({
        contents: new Buffer(require('../templates/editorconfig')),
        path: '.editorconfig'
      });
      this.push(file);
      cb();
    });
  };
};

