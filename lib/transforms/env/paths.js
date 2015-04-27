'use strict';

/**
 * Prime the `update.paths` object.
 */

module.exports = function paths_(app) {
  if (!app.has('paths')) app.paths = {};
};
