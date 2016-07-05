'use strict';

var utils = require('../utils');

/**
 * Remove names from the list of locally or globally stored updaters.
 *
 * ```sh
 * # remove updater `foo`
 * $ update -r foo
 * # or
 * $ update -rc foo
 * # sugar for
 * $ update --remove --config foo
 * # remove globally stored updaters
 * $ update -rg foo
 * # sugar for
 * $ update --remove --global foo
 * ```
 * @name tasks
 * @api public
 * @cli public
 */

module.exports = function(app, options) {
  return function(names, key, config, next) {
    var updaters = [];

    if (typeof names === 'string') {
      names = utils.toArray(names);
    }

    if (config.global) {
      updaters = app.globals.get('updaters') || [];
      app.globals.del('updaters');
      app.globals.set('updaters', utils.remove(updaters, names));
    }

    if (config.config || !config.global) {
      updaters = app.pkg.get('update.updaters') || [];
      app.pkg.del('update.updaters');
      app.pkg.set('update.updaters', utils.remove(updaters, names));
    }
    next();
  };
};
