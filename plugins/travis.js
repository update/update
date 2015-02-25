'use strict';

var gutil = require('gulp-util');
var through = require('through2');
var yaml = require('js-yaml');
var mixin = require('mixin-deep');
var utils = require('../lib/utils');
var logger = require('../lib/logging');

module.exports = function travis(verb) {
  return function() {
    return through.obj(function (file, enc, cb) {
      this.push(file);
      cb();
    }, function (cb) {
      var log = logger({nocompare: true});
      var tmpl = require('../templates/travis');
      var file = new gutil.File({path: '.travis.yml'});
      file.contents = new Buffer(tmpl);
      log.success(true, 'writing', file.relative);
      this.push(file);
      cb();
    });
  };
};
