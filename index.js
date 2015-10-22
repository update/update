/*!
 * update <https://github.com/jonschlinkert/update>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var ask = require('assemble-ask');
var Core = require('assemble-core');
var plugin = require('./lib/plugins');
var utils = require('./lib/');

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
  this.set('lookups.tasks', {});
  this.set('updaters', {});

  this.use(plugin.locals({name: 'update'}));
  this.use(plugin.store({name: 'update'}));
  this.use(plugin.config());
  this.use(ask());

  this.engine(['md', 'tmpl'], require('engine-base'));
  this.onLoad(/\.(md|tmpl)$/, function (view, next) {
    view.content = view.contents.toString();
    utils.matter.parse(view, next);
  });

  this.on('base.build', function () {
    base.lookup('tasks.base', Object.keys(base.tasks));
  });
};

Update.prototype.lookup = function(key, value) {
  if (arguments.length === 1) {
    return get(this.lookups, key);
  }
  if (arguments.length > 1 && Array.isArray(key)) {
    key = key.join('.');
  }
  utils.set(this.lookups, key, value);
  return this;
};

Update.prototype.updater = function(name, instance) {
  if (arguments.length === 1) {
    return this.updaters[name];
  }

  var keys = Object.keys(instance.tasks);
  this.lookup(['tasks', name], keys);
  utils.union(this, 'taskMap', keys);
  this.updaters[name] = instance;
  return this;
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
