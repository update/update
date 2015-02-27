/*!
 * update <https://github.com/jonschlinkert/update>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var fs = require('fs');
var path = require('path');

module.exports = {};

/**
 * Make the given directory and intermediates
 * if they don't already exist.
 *
 * @param {String} `dirpath`
 * @param {Number} `mode`
 * @return {String}
 * @api private
 */

module.exports.sync = function mkdir(dir, mode) {
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
};
