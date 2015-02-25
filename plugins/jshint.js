'use strict';

var gutil = require('gulp-util');
var through = require('through2');
var merge = require('merge-deep');
var sortObj = require('sort-object');
var logger = require('../lib/logging');
var utils = require('../lib/utils');

module.exports = function jshint(verb) {
  return function() {
    return through.obj(function (file, enc, cb) {
      if (file.isNull() || !file.isBuffer()) {
        this.push(file);
        return cb();
      }

      try {
        if (utils.contains(file.path, 'jshint')) {
          var str = file.contents.toString();
          var obj = JSON.parse(str);
          var log = logger(str);

          delete obj.globals;

          // TODO: move to user preferences
          obj = sortObj(merge(obj, {
            "asi": false,
            "boss": true,
            "curly": true,
            "eqeqeq": true,
            "eqnull": true,
            "esnext": true,
            "immed": true,
            "latedef": false,
            "laxcomma": false,
            "mocha": true,
            "newcap": true,
            "noarg": true,
            "node": true,
            "sub": true,
            "undef": true,
            "unused": true
          }));
          var res = JSON.stringify(obj, null, 2);
          log.success(res, 'updated properties in', file.relative);
          file.contents = new Buffer(res);
        }
      } catch (err) {
        console.log('jshint:', err);
        this.emit('error', new gutil.PluginError('update:jshint', err));
        return cb();
      }

      this.push(file);
      cb();
    });
  };
};
