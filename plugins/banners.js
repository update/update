'use strict';

var through = require('through2');
var debug = require('debug')('update:plugin');
var parse = require('parse-copyright');
var banner = require('update-banner');
var hasBanner = require('has-banner');
var merge = require('merge-deep');
var logger = require('../lib/logging');

module.exports = function(verb) {
  debug('banners plugin');
  return function(options) {
    var opts = merge({}, options);

    return through.obj(function (file, enc, cb) {
      debug('banners plugin file: %j', file.path);

      if (file.isNull() || !file.isBuffer()) {
        this.push(file);
        return cb();
      }

      var str = file.contents.toString();
      var log = logger(str);

      // TODO: implement better logic for ignoring banners that shouldn't
      // be stripped
      if ((hasBanner(str) || opts.banner) && !/@attribution/.test(str)) {
        var copyright = parse(str);
        if (copyright && copyright.length) {
          file.data.copyright = copyright[0];
        }
        str = banner(str, file.data);
        log.success(str, 'updated banners in', file.relative);
      }

      file.contents = new Buffer(str);
      this.push(file);
      cb();
    });
  };
};
