'use strict';

var utils = require('../../utils');

/**
 * Initialize default middleware
 */

module.exports = function middleware_() {
  this.onLoad(/./, utils.series([
    require('../../middleware/props'),
    require('../../middleware/engine'),
    require('../../middleware/cwd')(this),
    require('../../middleware/src'),
    require('../../middleware/dest'),
    // require('../../middleware/ext'),
    // require('../../middleware/dotfiles')(this),
  ]), error('.onLoad (.):'));
};

function error(method) {
  return function (err, file, next) {
    if (err) console.log(method, err);
    next();
  };
}
