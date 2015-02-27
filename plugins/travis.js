'use strict';

var gutil = require('gulp-util');
var through = require('through2');
var logger = require('../lib/logging');

/**
 * this plugin adds `.travis.yml` using a template
 * if the file is missing but tests exist.
 */

module.exports = function travis(verb) {
  return function () {
    return through.obj(function (file, enc, cb) {
      this.push(file);
      cb();
    }, function (cb) {

      if (!verb.exists('.travis.yml') && verb.exists('test*')) {
        var log = logger({nocompare: true});
        var tmpl = require('../templates/travis');
        var file = new gutil.File({
          contents: new Buffer(tmpl),
          path: '.travis.yml'
        });

        this.push(file);
        log.success(true, 'writing', file.relative);
      }

      cb();
    });
  };
};
