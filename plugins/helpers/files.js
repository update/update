'use strict';

var fs = require('fs');
var mm = require('micromatch');
var unique = require('array-unique');
var utils = require('../../lib/utils');

/**
 * Default paths to look for to populate the `files`
 * property of package.json
 */

var defaults = ['index.js', 'cli.js', 'lib/', 'bin/', 'completion/', 'templates/', 'app/'];

/**
 * Guess at which files should be included in package.json `files`.
 * This isn't meant to be comprehensive, it's intended to tip you
 * off that you need to fill in the field.
 */

module.exports = function(patterns, options) {
  patterns = patterns ? ensureSlash(patterns) : [];
  return function (files) {
    return unique(mm(files, defaults, options).concat(patterns));
  };
};

/**
 * Format paths so that directories end in a slash
 */

function ensureSlash(files) {
  var res = [], i = 0;
  var len;
  if (files && (len = files.length)) {
    while (len--) {
      var file = files[i++];
      if (typeof file !== 'string') {
        continue;
      }
      var stat = file && utils.tryStat(file);
      res.push(utils.trailingSlash(file, stat));
    }
  }
  return res;
}
