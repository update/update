/*!
 * update <https://github.com/jonschlinkert/update>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

/**
 * module dependencies
 */

var path = require('path');
var minimist = require('minimist');
var expand = require('expand-args');
var cli = require('base-cli');
var store = require('base-store');
var pipeline = require('base-pipeline');
var loader = require('assemble-loader');
var Core = require('assemble-core');
var ask = require('assemble-ask');

var config = require('./lib/config');
var locals = require('./lib/locals');
var utils = require('./lib/utils');

/**
 * Create an `update` application. This is the main function exported
 * by the update module.
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
  this.set('name', 'update');
  this.isUpdate = true;
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
  this.set('updaters', {});

  // custom middleware handlers
  this.handler('onStream');
  this.handler('preWrite');
  this.handler('postWrite');

  // parse command line arguments
  var argv = expand(minimist(process.argv.slice(2)));

  // expose `argv` on the instance
  this.mixin('argv', function(prop) {
    var args = [].slice.call(arguments);
    args.unshift(argv);
    return utils.get.apply(null, args);
  });

  // load the package.json for the updater
  this.data(utils.pkg(this.options.path));
  config(this);

  this.use(utils.runtimes())
    .use(locals('update'))
    .use(store())
    .use(pipeline())
    .use(loader())
    .use(ask())
    .use(cli())

    .use(utils.defaults())
    .use(utils.opts())

  var data = utils.get(this.cache.data, 'update');
  data = utils.extend({}, data, argv);

  this.config.process(data);

  this.engine(['md', 'tmpl'], require('engine-base'));
  this.onLoad(/\.(md|tmpl)$/, function (view, next) {
    utils.matter.parse(view, next);
  });
};

Update.prototype.cwd = function(dir) {
  var cwd = dir || process.cwd();
  return function() {
    var args = [].slice.call(arguments);
    args.unshift(cwd);
    return path.resolve.apply(null, args);
  };
};

Update.prototype.flag = function(key) {
  return this.get('argv.' + key);
};

Update.prototype.cmd = function(key) {
  return utils.commands(this.argv)[key] || false;
};

Update.prototype.extendFile = function(file, config, opts) {
  var parsed = utils.tryParse(file.content);
  var obj = utils.extend({}, parsed, config);
  var res = {};
  if (opts && opts.sort === true) {
    var keys = Object.keys(obj).sort();
    var len = keys.length, i = -1;
    while (++i < len) {
      var key = keys[i];
      res[key] = obj[key];
    }
  } else {
    res = obj;
  }
  file.content = JSON.stringify(res, null, 2);
  if (opts.newline) file.content += '\n';
};

/**
 * Register updater `name` with the given `update`
 * instance.
 *
 * @param {String} `name`
 * @param {Object} `update` Instance of update
 * @return {Object} Returns the instance for chaining
 */

Update.prototype.updater = function(name, app) {
  if (arguments.length === 1) {
    return this.updaters[name];
  }
  app.use(utils.runtimes({
    displayName: function(key) {
      return utils.cyan(name + ':' + key);
    }
  }));
  return (this.updaters[name] = app);
};

/**
 * Expose `Update`
 */

module.exports = Update;

/**
 * Expose `utils`
 */

module.exports.utils = utils;

/**
 * Expose package.json metadata
 */

module.exports.pkg = require('./package');
