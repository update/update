
var path = require('path');
var pipeline = require('stream-combiner');
var through = require('through2');
var typeOf = require('kind-of');
var utils = require('./lib/utils');

module.exports = function(app) {
  this.fns = this.fns || {};
  this.define('stack', []);

  /**
   * Register a plugin by `name`
   *
   * @param  {String} `name`
   * @param  {Function} `fn`
   * @api public
   */

  this.define('plugin', function(name, fn) {
    if (!typeof name === 'string') {
      throw new TypeError('expected plugin name to be a string');
    }
    if (arguments.length === 1) {
      return this.fns[name];
    }
    this.stack.push(fn);
    this.fns[name] = fn;
    return this;
  });

  /**
   * Create a plugin pipeline from an array of fns.
   *
   * @param  {Array} `fns` Each plugin is a function that returns a stream,
   *                       or the name of a registered plugin.
   * @param  {Object} `options`
   * @return {Stream}
   * @api public
   */

  this.define('pipeline', function(plugins, options) {
    if (isStream(plugins)) return plugins;

    if (!Array.isArray(plugins)) {
      options = typeOf(plugins) === 'object' ? plugins : {};
      plugins = this.stack;
    }

    var len = plugins.length, i = -1;
    var fns = [];

    while (++i < len) {
      var plugin = normalize(app, plugins[i], options);
      if (!plugin) continue;
      fns.push(plugin);
    }
    return pipeline.apply(pipeline, fns);
  });
};

function normalize(app, val, options) {
  if (typeof val === 'string' && app.fns.hasOwnProperty(val)) {
    if (app.isFalse('plugin.' + val)) return null;
    return normalize(app, app.fns[val]);
  }
  if (typeof val === 'function') {
    return val.call(app, app.opts(options));
  }
  if (isStream(val)) {
    val.on('error', app.emit.bind(app, 'error'));
    return val;
  }
}

function isStream(val) {
  return val && typeof val === 'object'
    && typeof val.pipe === 'function';
}
