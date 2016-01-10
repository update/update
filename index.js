'use strict';

/**
 * module dependencies
 */

var path = require('path');
var Generate = require('generate');
var ignore = require('./lib/ignore');
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
  enable('ignore', ignore);
  enable('middleware', utils.middleware);
  enable('loader', utils.loader);
  enable('config', utils.config);
  enable('pkg', utils.pkg);
  enable('cli', cli);

  function enable(name, fn) {
    if (app.option('plugins') === false) return;
    if (app.option('plugins.' + name) !== false) {
      app.use(fn(app.options));
    }
  }
};

/**
 * Set `prop` with the given `value`, but only if `prop` is
 * not already defined.
 *
 * ```js
 * app.set('cwd', 'foo');
 * app.fillin('cwd', process.cwd());
 * console.log(app.get('cwd'));
 * //=> 'foo'
 * ```
 * @param {String} prop
 * @param {any} val
 * @return {Object} Returns the instance for chaining
 * @api public
 */

Update.prototype.fillin = function(prop, val) {
  var current = this.get(prop);
  if (typeof current === 'undefined') {
    this.set(prop, val);
  }
  return this;
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
 * Ensure `name` is set on the instance for lookups.
 */

Object.defineProperty(Update.prototype, 'cwd', {
  configurable: true,
  set: function(cwd) {
    this.options.cwd = path.resolve(cwd);
  },
  get: function() {
    var cwd = this.get('env.user.cwd') || this.options.cwd || process.cwd();
    return (this.options.cwd = path.resolve(cwd));
  }
});

/**
 * Expose `Update`
 */

module.exports = Update;
