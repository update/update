/*!
 * update <https://github.com/jonschlinkert/update>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var argv = require('minimist');
var cli = require('base-cli');
var ask = require('assemble-ask');
var Core = require('assemble-core');
var loader = require('assemble-loader');
var config = require('./lib/config');
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
  this.set('argv', this.argv || argv(process.argv.slice(2)));
  this.set('updaters', {});

  this
    .use(utils.runtimes())
    .use(plugin.locals({name: this.name}))
    .use(plugin.store({name: this.name}))
    .use(config())
    .use(loader())
    .use(ask())
    .use(cli);

  this.engine(['md', 'tmpl'], require('engine-base'));
  this.onLoad(/\.(md|tmpl)$/, function (view, next) {
    view.content = view.contents.toString();
    utils.matter.parse(view, next);
  });
};

Update.prototype.flag = function(key) {
  return utils.expandArgs(this.argv)[key];
};

Update.prototype.cmd = function(key) {
  return utils.commands(utils.expandArgs(this.argv))[key] || false;
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

Update.prototype.hasUpdater = function(name) {
  return this.updaters.hasOwnProperty(name);
};

Update.prototype.hasTask = function(name) {
  return this.taskMap.indexOf(name) > -1;
};

Update.prototype.opts = function(prop, options) {
  var args = [].concat.apply([], [].slice.call(arguments));
  if (typeof opts === 'string') {
    args.unshift(this.option(args.shift()));
  } else {
    args.unshift(this.options);
  }
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
