'use strict';

var fs = require('fs');
var path = require('path');

/**
 * Make the given directory and intermediates
 * if they don't already exist.
 *
 * @param {String} `dirpath`
 * @param {Number} `mode`
 * @return {String}
 * @api private
 */

function mkdir(dir, mode) {
  mode = mode || parseInt('0777', 8) & (~process.umask());
  if (!fs.existsSync(dir)) {
    var parent = path.dirname(dir);

    if (fs.existsSync(parent)) {
      fs.mkdirSync(dir, mode);
    } else {
      mkdir(parent);
      fs.mkdirSync(dir, mode);
    }
  }
}
