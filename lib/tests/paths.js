'use strict';

var regex = require('requires-regex');

module.exports = function paths(file, verb) {
  var str = file.contents.toString();

  // body...  // test.js is at the root, let's make sure
  // the path to `index.js` is correct
  if (file.path.indexOf('test/') === -1) {
    str.replace(regex(), function ($1, $2, $3, fp) {
      if (fp && fp === '../' || fp === '..') {
        str = str.replace(fp, './');
      }
    });
  }

  file.contents = new Buffer(str);
  return file;
};
