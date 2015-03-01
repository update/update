'use strict';

/**
 * Module dependencies
 */

var sortObj = require('sort-object');
var helpers = require('export-files')(__dirname);

/**
 * Local dependencies
 */

var logger = require('../lib/logging');
var utils = require('../lib/utils');

/**
 * Normalize fields in package.json
 */

module.exports = function (file, verb) {
  var str = file.contents.toString();
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

  log.results(res, 'updated properties in', file.relative);
  file.contents = new Buffer(res);
  return file;
}
