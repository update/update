'use strict';

/**
 * module dependencies
 */

var path = require('path');
var Generate = require('generate');
var utils = require('./lib/utils');
var cli = require('./lib/cli');

/**
 * Create an `update` instance. This is the main function exported
 * by the update module.
 *
 * ```js
 * var update = require('update');
 * var app = update();
 * ```
 * @param {Object} `options` Optionally pass default options to use.
 * @api public
 */

function Update(options) {
  if (!(this instanceof Update)) {
    return new Update(options);
  }

  Generate.apply(this, arguments);
  this.updaters = this.generators;
  this.isUpdate = true;
  this.initPlugins(this);
}

/**
 * Inherit Generate
 */

Generate.extend(Update);

/**
 * Load default plugins. Built-in plugins can be disabled
 * on the `update` options.
 *
 * ```js
 * var app = update({
 *   plugins: {
 *     loader: false,
 *     store: false
 *   }
 * });
 * ```
 */

Update.prototype.initPlugins = function(app) {
  enable('middleware', utils.middleware);
  enable('loader', utils.loader);
  enable('config', utils.config);
  enable('cli', cli);

  function enable(name, fn) {
    if (app.option('plugins') === false) return;
    if (app.option('plugins.' + name) !== false) {
      app.use(fn(app.options));
    }
  }
};

/**
 * Ensure `name` is set on the instance for lookups.
 */

Object.defineProperty(Update.prototype, 'name', {
  configurable: true,
  set: function(name) {
    this.options.name = name;
  },
  get: function() {
    return this.options.name || 'update';
  }
});

/**
 * Expose `Update`
 */

module.exports = Update;
