'use strict';

var transforms = require('./transforms');
var updaters = transforms.updaters;
var init = transforms.init;
var env = transforms.env;

/**
 * Load initialization transforms:
 *  | runner
 *  | loaders
 *  | create
 *  | options
 *  | middleware
 *  | plugins
 *  | load
 *  | engines
 *  | helpers (load last)
 */

module.exports = function init_(app) {
  app.transform('updaters', updaters);
  app.transform('session', init.session);
  app.transform('store', init.store);
};
