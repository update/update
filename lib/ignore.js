'use strict';

var fs = require('fs');
var path = require('path');
var utils = require('./utils');

/**
 * Common directories to ignore
 */

var exclusions = [
  '.git',
  'actual',
  'coverage',
  'expected',
  'fixtures',
  'node_modules',
  'temp',
  'templates',
  'test/actual',
  'test/fixtures',
  'tmp',
  'vendor',
  'wip'
];

/**
 * Directories to exclude in the search
 */

module.exports = function(options) {
  var opts = utils.merge({}, options);

  return function(app) {

    this.define('ignores', function(patterns) {
      patterns = utils.arrayify(patterns);

      var pkgIgnores = this.pkg.get('update.ignore') || [];
      var arr = ignores(patterns, this.cwd);
      arr = arr.concat(pkgIgnores);

      var res = arr.map(function(pattern) {
        pattern = pattern.replace(/^[*]{2}|[*]{2}$/, '');
        pattern = pattern.replace(/^\/|\/$/, '');
        return '**/' + pattern + '/**';
      });
      return utils.unique(res);
    });
  };
};

/**
 * Directories to exclude in the search
 */

function ignores(customPatterns, cwd) {
  return gitignore('.gitignore', cwd)
    .concat(customPatterns || [])
    .concat(exclusions)
    .sort();
}

/**
 * Parse the local `.gitignore` file and add
 * the resulting ignore patterns.
 */

function gitignore(fp, cwd) {
  fp = path.resolve(cwd, fp);
  if (!utils.exists(fp)) {
    return [];
  }
  return utils.parseGitignore(fp);
}
