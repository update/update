'use strict';

var session = require('../session');

/**
 * The first transform to be run at init.
 */

module.exports = function session_(app) {
  app.session = session;
};
