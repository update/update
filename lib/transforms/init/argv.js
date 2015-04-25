'use strict';

/**
 * Prime `app.cache.argv`
 */

module.exports = function argv_(app) {
  app.cache.argv = app.cache.argv || [];
};
