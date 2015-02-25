'use strict';

var gutil = require('gulp-util');
var through = require('through2');
var utils = require('../lib/utils');
var logger = require('../lib/logging');

module.exports = function editorconfig(verb) {
  return function() {
    var writeFile = false;

    return through.obj(function (file, enc, cb) {
      this.push(file);
      cb();
    }, function (cb) {
      var stats = verb.get('stats');
      if (stats.files.indexOf('.editorconfig') === -1) {
        var tmpl = require('../templates/editorconfig');
        var file = new gutil.File({path: '.editorconfig'});
        file.contents = new Buffer(tmpl);
        this.push(file);
      }
      cb();
    });
  };
};

