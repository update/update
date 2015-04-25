'use strict';

/**
 * Load built-in engines
 */

module.exports = function engines_(app) {
  app.engine('*', require('engine-lodash'), {
    delims: ['<%', '%>']
  });
};
