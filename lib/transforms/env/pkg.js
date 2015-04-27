'use strict';

var utils = require('../../utils');
var cache = {};

/**
 * Extend the package.json object onto `update.cache.data`.
 * Called in the `init` transform.
 */

module.exports = function pkg_(app) {
  var filename = app.option('config') || 'package.json';

  app.data(filename, function (fp) {
    return cache[fp] || (cache[fp] = utils.tryRequire(fp));
  });
};
