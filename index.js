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

Update.prototype.initPlugins = function() {
  this.use(utils.middleware())
    .use(utils.loader())
    .use(utils.pkg())
    .use(config())
    .use(cli());
};

/**
 * Lazily add gitignore patterns to `update.cache.ignores`
 *
 * @return {[type]}
 */

Update.prototype.lazyIgnores = function() {
  if (!this.cache.ignores) {
    this.set('cache.ignores', ignore.gitignore(this.cwd));
  }
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
  // "views" are "template objects", but we're
  // exposing them as `files`
  var file = this.files.getView(pattern);
  if (file) return file;
  for (var key in this.views.files) {
    var file = this.views.files[key];
    if (file.basename === pattern) return file;
    if (file.filename === pattern) return file;
    if (file.path === pattern) return file;
    if (file.key === pattern) return file;
    if (utils.mm.isMatch(key, pattern)) {
      return file;
    }
  }
  return null;
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
