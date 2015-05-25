'use strict';

var loaders = require('../../loaders');

/**
 * Load built-in loaders
 */

module.exports = function base_(app) {
  app.loader('base', [loaders.base]);
  app.loader('file', [loaders.file]);
};
