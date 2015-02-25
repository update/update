'use strict';


var unique = require('array-unique');
var files = require('./files');

module.exports = function(pkg, file) {
  // populate the `browser` property
  var browser = files.toFiles(file.base, ['browser.js']);
  if (browser.length || pkg.browser && pkg.browser.length) {
    pkg.browser = unique(browser, pkg.browser);
  }
  return pkg;
};

