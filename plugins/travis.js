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
      if (file.isNull() || !file.isBuffer()) {
        this.push(file);
        return cb();
      }

      try {
        var str = file.contents.toString();
        var log = logger({nocompare: true});
        // var obj = yaml.load(str);

        file.contents = new Buffer([
          'sudo: false',
          'language: node_js',
          'node_js:',
          '  - "0.10"',
          '  - "0.12"',
          '  - "iojs"',
          'git:',
          '  depth: 10',
        ].join('\n'));

        log.success(true, 'loaded data from', file.relative);
      } catch (err) {
        console.log(err);
        this.emit('error', new gutil.PluginError('update:travis', err));
        return cb();
      }

      this.push(file);
      cb();
    });
  };
};
