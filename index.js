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
  this.isUpdate = true;

  this.initDefaults(this);
  this.initPlugins(this);
  this.initCollections(this);
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
  enable('argv', utils.argv);
  enable('cli', cli);

  function enable(name, fn) {
    if (app.option('plugins') === false) return;
    if (app.option('plugins.' + name) !== false) {
      app.use(fn(app.options));
    }
  }
};

/**
 * Built-in view collections
 *  | partials
 *  | layouts
 *  | pages
 */

Update.prototype.initCollections = function(app) {
  if (this.option('collections') === false) return;

  var engine = this.options.defaultEngine || 'hbs';
  this.create('partials', {
    engine: engine,
    viewType: 'partial',
    renameKey: function(fp) {
      return path.basename(fp, path.extname(fp));
    }
  });

  this.create('layouts', {
    engine: engine,
    viewType: 'layout',
    renameKey: function(fp) {
      return path.basename(fp, path.extname(fp));
    }
  });

  this.create('pages', {
    engine: engine,
    renameKey: function(fp) {
      return fp;
    }
  });
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
    return this.options.name || 'base';
  }
});

/**
 * Expose `Update`
 */

module.exports = Update;
