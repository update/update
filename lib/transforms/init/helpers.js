'use strict';

/**
 * Load default helpers
 */

module.exports = function helpers_(app) {
  require('../../helpers/sync')(app);
  require('../../helpers/async')(app);
  require('../../helpers/collections')(app);
};
