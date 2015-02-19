/**
 * update <https://github.com/jonschlinkert/update>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT license.
 */

'use strict';

var through = require('through2');
var merge = require('merge-deep');
var parseCopyright = require('parse-copyright');
var copyright = require('update-copyright');

module.exports = function(verb) {
  return function() {
    return through.obj(function (file, enc, cb) {
      if (file.isNull() || !file.isBuffer()) {
        this.push(file);
        return cb();
      }

      var str = file.contents.toString();
      var parsed = parseCopyright(str);
      var data = {};

      if (parsed && parsed[0]) {
        data.copyright = parsed[0].latest;
        verb.data(data);
        merge(file.data, data);
        console.log('copyright data added to the context.');
      }

      file.contents = new Buffer(copyright(str));
      console.log('copyright updated in', file.relative);
      this.push(file);
      cb();
    });
  };
}
