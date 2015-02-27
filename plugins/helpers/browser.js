'use strict';


var unique = require('array-unique');
var files = require('./files');

/**
 * TODO: list files to browserify
 */

module.exports = function(pkg, file) {
  // populate the `browser` property
  // var browser = files.toFiles(file.base, ['browser.js']);
  // if (browser.length || pkg.browser && pkg.browser.length) {
  //   pkg.browser = unique(browser, pkg.browser);
  // }
  return [];
};

