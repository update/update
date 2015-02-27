'use strict';

/**
 * Module dependencies
 */

var path = require('path');
var diff = require('arr-diff');
var gutil = require('gulp-util');
var omitEmpty = require('omit-empty');
var through = require('through2');
var update = require('update-package');
var sortObj = require('sort-object');

/**
 * Local dependencies
 */

var helpers = require('./helpers/');
var logger = require('../lib/logging');
var utils = require('../lib/utils');

/**
 * virtually everything in this file is a temporary
 * hack until I get update-package straightened out.
 */

module.exports = function(verb) {
  return function() {
    return through.obj(function (file, enc, cb) {
      if (file.isNull() || !file.isBuffer() || path.basename(file.path) !== 'package.json') {
        this.push(file);
        return cb();
      }

      try {
        if (utils.contains(file.path, 'package.json')) {
          var str = file.contents.toString();
          // pass the initial string to the logger.
          var log = logger(str);

          // parse the string
          var obj = JSON.parse(str);

          // run updates on package.json fields
          var pkg = update(obj);

          // remove old verb from deps
          pkg = helpers.devDependencies.removeVerb(pkg);

          // populate the `files` property. Not exposed on options
          // currently, but can be if someone suggests a good option
          var matched = require('./helpers/files')(pkg.files);
          var files = verb.get('stats.files');
          pkg.files = matched(files);

          // fix the scripts property
          pkg = helpers.scripts.fixMocha(pkg);

          // if should doesn't exist, remove it
          if (!verb.get('data.hasShould')) {
            pkg = helpers.devDependencies.removeShould(pkg);
          }

          // fix the `license` and `licenses` properties
          pkg = helpers.licenses.normalize(pkg);
          pkg = helpers.license.normalize(pkg);
          pkg = omitEmpty(pkg);

          var keys = helpers.keys.concat(diff(Object.keys(pkg), helpers.keys));
          var sorted = sortObj(pkg, keys);
          var res = JSON.stringify(sorted, null, 2);

          log.success(res, 'updated properties in', file.relative);
          file.contents = new Buffer(res);
        }

      } catch (err) {
        console.log(err);
        this.emit('error', new gutil.PluginError('update:pkg', err));
        return cb();
      }


      this.push(file);
      cb();
    });
  };
};
