/**
 * update <https://github.com/jonschlinkert/update>
 *
 * Copyright (c) 2014-2015, Jon Schlinkert.
 * Licensed under the MIT license.
 */

'use strict';

var fs = require('fs');
var path = require('path');
var through = require('through2');
var banner = require('update-banner');
var parseCopyright = require('parse-copyright');
var copyright = require('update-copyright');
var license = require('update-license');
// var pkg = require('update-pkg');
var verbfile = require('./lib/verb');


module.exports = function (verb) {
  exports.verbfile = function (options) {
    return through.obj(function (file, enc, cb) {
      if (!file.isNull()) {
        this.push(file);
        return cb();
      }
      if (!file.isBuffer()) {
        this.push(file);
        return cb();
      }

      var year = verb.get('data.copyright') || new Date().getFullYear();
      var str = verbfile(toString(file), year);
      file.contents = new Buffer(str);
      this.push(file);
      cb();
    });
  };

  exports.banners = function (options) {
    return through.obj(function (file, enc, cb) {
      if (!file.isNull()) {
        this.push(file);
        return cb();
      }
      if (!file.isBuffer()) {
        this.push(file);
        return cb();
      }

      var str = banner(toString(file));
      file.contents = new Buffer(str);
      this.push(file);
      cb();
    });
  };

  exports.dotfiles = function (options) {
    return through.obj(function (file, enc, cb) {
      if (!file.isNull()) {
        this.push(file);
        return cb();
      }
      if (!file.isBuffer()) {
        this.push(file);
        return cb();
      }

      var str = toString(file);
      if (contains(file, '.gitattributes')) {
        str = '*.* text';
      }

      file.contents = new Buffer(str);
      this.push(file);
      cb();
    });
  };

  // exports.copyright = function (options) {
  //   return through.obj(function (file, enc, cb) {
  //     var str = toString(file.contents);


  //     this.push(file);
  //     cb();
  //   });
  // };

  exports.getCopyright = function (filename) {
    var idx = path.resolve(process.cwd(), filename);
    if (fs.existsSync(idx)) {
      verb.data(idx, function (fp) {
        var str = fs.readFileSync(fp, 'utf8');
        var parsed = parseCopyright(str);
        var res = {};
        if (parsed) {
          res.copyright = parsed[0].latest;
        }
        return res;
      });
    }
  };
  return exports;
};

// function toStream(options, cb) {
//
//   return through.obj(function (file, enc, cb) {
//     var str = toString(file.contents);


//     this.push(file);
//     cb();
//   });
// }

function toString(file) {
  return file && file.contents && file.contents.toString();
}

function contains(file, name) {
  return file.path.indexOf(name) !== -1;
}
