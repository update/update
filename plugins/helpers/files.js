'use strict';

var fs = require('fs');
var unique = require('array-unique');
var mm = require('micromatch');
var utils = require('../../lib/utils');

/**
 * Guess at which files should be included in package.json `files`.
 * This isn't meant to be comprehensive, it's intended to tip you
 * off that you need to fill in the field.
 */

module.exports = function(patterns, options) {
  var defaults = ['index.js', 'cli.js', 'lib/', 'bin/', 'completion/', 'templates/', 'app/'];
  patterns = patterns ? formatPatterns(patterns) : [];

  return function (files) {
    return unique(mm(files, defaults, options).concat(patterns));
  }
};

function formatPatterns(files) {
  var res = [], i = 0;
  var len;
  if (files && (len = files.length)) {
    while (len--) {
      var file = files[i++];
      var stat = fs.statSync(file);
      res.push(utils.trailingSlash(file, stat));
    }
  }
  return res;
}
