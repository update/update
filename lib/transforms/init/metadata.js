'use strict';

var path = require('path');

/**
 * Adds Updates's package.json data to `update.metadata`.
 *
 * Called in the `init` transform.
 */

module.exports = function metadata_(app) {
  Object.defineProperty(app, 'metadata', {
    get: function () {
      return require(path.resolve(__dirname, '../../..', 'package.json'));
    },
    set: function () {
      console.log('`update.metadata` is read-only and cannot be modified.');
    }
  });
};
