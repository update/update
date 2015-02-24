'use strict';

var through = require('through2');
var logger = require('../lib/logging');
var tests = require('../lib/tests');

module.exports = function(verb) {
  return function() {
    return through.obj(function (file, enc, cb) {
      if (file.isNull() || !file.isBuffer()) {
        this.push(file);
        return cb();
      }

      if (utils.contains(file.path, 'test')) {
        var str = file.contents.toString();
        var log = logger(str);

        var hasShould = /['"]should/.test(str);
        verb.set('data.hasShould', hasShould);

        // `should` exists in test files
        if (hasShould) {
          str = tests.fixShould(str, file.relative);
          log.success(str, 'updated "should" statements in', file.relative);
        }

        var deps = verb.env.devDependencies;
        if (hasShould && !deps.hasOwnProperty('should')) {
          console.log(verb.env);
        }
        file.contents = new Buffer(str);
      }

      this.push(file);
      cb();
    });
  }
};
