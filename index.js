'use strict';

/**
 * module dependencies
 */

var path = require('path');
var Generate = require('generate');
var config = require('./lib/config');
var ignore = require('./lib/ignore');
var utils = require('./lib/utils');
var cli = require('./lib/cli');

/**
 * Create an instance of `Update`. This is the main function exported
 * by the update module, used for creating `updaters`.
 *
 * ```js
 * var Update = require('update');
 * var update = new Update();
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

  this.initPlugins();
  this.lazyCollections();
  this.initUpdate(this);
}

/**
 * Inherit Generate
 */

Generate.extend(Update);

/**
 * Lazily initialize default collections
 */

Update.prototype.lazyCollections = function() {
  if (!this.templates) {
    this.create('files');
    this.create('templates');
  }
};

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

Update.prototype.initPlugins = function() {
  this.use(utils.middleware())
    .use(utils.loader())
    .use(utils.pkg())
    .use(config())
    .use(cli());
};

/**
 * Lazily add gitignore patterns to `update.cache.ignores`
 */

Update.prototype.lazyIgnores = function() {
  if (!this.cache.ignores) {
    this.union('ignores', ignore.gitignore(this.cwd));
  }
};

/**
 * Initialize `update` defaults
 */

Update.prototype.initUpdate = function(app) {
  this.on('build', function(app, env) {
    var ignores = app.get('cache.ignores');
    var cwd = env.config.cwd;

    app.templates('templates/*', {
      ignore: ignores,
      cwd: cwd,
      renameKey: function(key, view) {
        var cwd = path.resolve(env.config.cwd);
        return path.relative(cwd, path.resolve(cwd, key));
      }
    });
  });
};

/**
 * Add ignore patterns to the `update.cache.ignores` array. This
 * array is initially populated with patterns from `gitignore`
 *
 * ```js
 * update.ignore(['foo', 'bar']);
 * ```
 * @param {String|Array} `patterns`
 * @return {Object} returns the instance for chaining
 * @api public
 */

Update.prototype.ignore = function(patterns) {
  this.lazyIgnores();
  this.union('ignores', ignore.toGlobs(patterns));
  return this;
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
 * @param {String} `prop` The name of the property to define
 * @param {any} `val` The value to use if a value is _not already defined_
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
 * Get a file from the `update.files` collection.
 *
 * ```js
 * update.getFile('LICENSE');
 * ```
 * @param {String} `pattern` Pattern to use for matching. Checks against
 * @return {Object} If successful, a `file` object is returned, otherwise `null`
 * @api public
 */

Update.prototype.getFile = function(pattern) {
  return utils.getFile(this, 'files', pattern);
};

/**
 * Get a template from the `update.templates` collection.
 *
 * ```js
 * update.getTemplate('foo.tmpl');
 * ```
 * @param {String} `pattern` Pattern to use for matching. Checks against
 * @return {Object} If successful, a `file` object is returned, otherwise `null`
 * @api public
 */

Update.prototype.getTemplate = function(pattern) {
  return utils.getFile(this, 'templates', pattern);
};

/**
 * Create or append array `name` on `update.cache` with the
 * given (uniqueified) `items`. Supports setting deeply nested
 * properties using using object-paths/dot notation.
 *
 * ```js
 * update.union('foo', 'bar');
 * update.union('foo', 'baz');
 * update.union('foo', 'qux');
 * update.union('foo', 'qux');
 * update.union('foo', 'qux');
 * console.log(update.cache.foo);
 * //=> ['bar', 'baz', 'qux'];
 * ```
 * @param {String} `name`
 * @param {any} `items`
 * @return {Object} returns the instance for chaining
 * @api public
 */

Update.prototype.union = function(name, items) {
  utils.union(this.cache, name, utils.arrayify(items));
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
    return path.resolve(cwd);
  }
});

/**
 * Expose `Update`
 */

module.exports = Update;
