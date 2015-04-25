'use strict';

/**
 * Prime the `file` object with properties that
 * can be extended in plugins.
 */

module.exports = function cwd_(app) {
  return function (file, next) {
    file.cwd = file.data.cwd || app.cwd || file.cwd || '.';
    next();
  };
};
