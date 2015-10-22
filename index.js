/*!
 * update <https://github.com/jonschlinkert/update>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var ask = require('assemble-ask');
var Core = require('assemble-core');
var loader = require('assemble-loader');
var plugin = require('./lib/plugins');
var utils = require('./lib/utils');

/**
 * Create an instance of `Update` with the given `options`
 *
 * ```js
 * var Update = require('update');
 * var update = new Update();
 * ```
 * @param {Object} `options`
 * @api public
 */

function Update(options) {
  if (!(this instanceof Update)) {
    return new Update(options);
  }
  Core.call(this, options);
  this.name = this.options.name || 'update';
  this.initUpdate(this);
}

/**
 * Inherit assemble-core
 */

Core.extend(Update);

/**
 * Initialize Updater defaults
 */

Update.prototype.initUpdate = function(base) {
  this.define('isUpdate', true);
  this.set('updaters', {});

  this.use(plugin.locals({name: this.name}));
  this.use(plugin.store({name: this.name}));
  this.use(plugin.config());
  this.use(loader());
  this.use(ask());

  this.engine(['md', 'tmpl'], require('engine-base'));
  this.onLoad(/\.(md|tmpl)$/, function (view, next) {
    view.content = view.contents.toString();
    utils.matter.parse(view, next);
  });
};

/**
 * Register updater `name` with the given `update`
 * instance.
 *
 * @param {String} `name`
 * @param {Object} `update` Instance of update
 * @return {Object} Returns the instance for chaining
 */

Update.prototype.updater = function(name, update) {
  if (arguments.length === 1) {
    return this.updaters[name];
  }
  update.use(utils.runtimes({
    displayName: function(key) {
      return utils.cyan(name + ':' + key);
    }
  }));
  return (this.updaters[name] = update);
};

Update.prototype.build = function() {
  var fn = Core.prototype.build;
  this.emit('build');
  return fn.apply(this, arguments);
};

Update.prototype.hasUpdater = function(name) {
  return this.updaters.hasOwnProperty(name);
};

Update.prototype.hasTask = function(name) {
  return this.taskMap.indexOf(name) > -1;
};

Update.prototype.opts = function(prop, options) {
  var args = [].concat.apply([], [].slice.call(arguments, 1));
  args.unshift(this.option(prop));
  return utils.extend.apply(utils.extend, args);
};

/**
 * Expose `Update`
 */

module.exports = Update;

/**
 * Expose `utils`
 */

module.exports.utils = utils;
module.exports.meta = require('./package');
module.exports.dir = __dirname;
