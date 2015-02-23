'use strict';

var through = require('through2');
var merge = require('merge-deep');
var sortObj = require('sort-object');
var logger = require('../lib/logging');

module.exports = function jshintPlugin() {
  return through.obj(function (file, enc, cb) {
    if (file.isNull() || !file.isBuffer()) {
      this.push(file);
      return cb();
    }

    var obj = JSON.parse(file.contents.toString());
    var log = logger({nocompare: true});

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

    file.contents = new Buffer(JSON.stringify(obj, null, 2));
    log.success(true, 'updated properties in', file.relative);
    this.push(file);
    cb();
  });
};
