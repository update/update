/*!
 * update <https://github.com/jonschlinkert/update>
 *
 * Copyright (c) 2016, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var Base = require('assemble-core');
var resolve = require('resolve-file');
var utils = require('./lib/utils');
var cli = require('./lib/cli');

/**
 * Create a update application with `options`.
 *
 * ```js
 * var update = require('update');
 * var app = update();
 * ```
 * @param {Object} `options` Settings to initialize with.
 * @api public
 */

function Update(options) {
  if (!(this instanceof Update)) {
    return new Update(options);
  }
  Base.call(this, options);
  this.is('update');
  this.initUpdate(this);
  this.initDefaults();
}

/**
 * Inherit `Base`
 */

Base.extend(Update);

/**
 * Initialize defaults, emit events before and after
 */

Update.prototype.initUpdate = function() {
  Update.emit('update.preInit', this);
  Update.plugins(this);
  Update.emit('update.postInit', this);
};

/**
 * Initialize `Update` defaults
 */

Update.prototype.initDefaults = function() {
  this.define('generators', this.generators);
  this.define('updater', this.generator);
  this.updaters = this.generators;

  this.option('help', {
    configname: 'updater',
    appname: 'update'
  });

  this.define('update', this.generate);

  this.define('getUpdater', function() {
    return this.getGenerator.apply(this, arguments);
  });

  this.option('toAlias', function(name) {
    return name.replace(/^updater?-(.*)$/, '$1');
  });

  function isUpdater(name) {
    return /^(updater|generate)?-/.test(name);
  }

  this.option('lookup', function(name) {
    var patterns = [];
    if (!isUpdater(name)) {
      patterns.push(`updater-${name}`);
    }
    return patterns;
  });

  this.on('unresolved', function(search, app) {
    if (!isUpdater(search.name)) return;
    var resolved = resolve.file(search.name) || resolve.file(search.name, {cwd: utils.gm});
    if (resolved) {
      search.app = app.generator(search.name, require(resolved.path));
    }
  });
};

/**
 * Expose plugins on the constructor to allow other `base`
 * apps to use the plugins before instantiating.
 */

Update.prototype.configfile = function(cwd) {
  return utils.configfile(cwd);
};

/**
 * Get the list of updaters to run
 */

Update.prototype.getUpdaters = function(names, options) {
  if (utils.isObject(names)) {
    options = names;
    names = [];
  }
  options = options || {};
  var updaters = this.option('updaters');
  this.addUpdaters(names, options);
  if (utils.isEmpty(updaters)) {
    updaters = this.pkg.get('update.updaters');
  }
  if (utils.isEmpty(updaters)) {
    updaters = this.store.get('updaters');
  }
  if (options.remove) {
    updaters = utils.remove(updaters, utils.toArray(options.remove));
  }
  if (options.add) {
    updaters = utils.union([], updaters, utils.toArray(options.add));
  }
  return updaters;
};

/**
 * Get the list of updaters to run
 */

Update.prototype.addUpdaters = function(names, options) {
  options = options || {};
  if (typeof names === 'string') {
    names = utils.toArray(names);
  }
  if (options.config) {
    this.pkg.union('update.updaters', names);
  }
  if (options.global) {
    this.store.union('updaters', names);
  }
};

/**
 * Expose plugins on the constructor to allow other `base`
 * apps to use the plugins before instantiating.
 */

Update.plugins = function(app) {
  app.use(utils.generators());
  app.use(utils.store('update'));
  app.use(utils.runtimes());
  app.use(utils.questions());
  app.use(utils.loader());
  app.use(utils.config());
  app.use(utils.cli());
};

/**
 * Get the updaters or tasks to run from user config
 */

Update.resolveTasks = function(app, argv) {
  var tasks = utils.arrayify(argv._);
  if (tasks.length && utils.contains(['help', 'list', 'new', 'default'], tasks)) {
    app.enable('silent');
    return tasks;
  }

  if (tasks.length && !utils.contains(['help', 'list', 'new', 'default'], tasks)) {
    return tasks;
  }

  tasks = app.getUpdaters(argv.add, argv);
  if (!tasks || !tasks.length) {
    return ['init'];
  }
  return tasks;
};

/**
 * Expose logging methods
 */

Object.defineProperty(Update.prototype, 'log', {
  configurable: true,
  get: function() {
    function log() {
      return console.log.apply(console, arguments);
    }
    log.warn = function(msg) {
      return utils.logger('warning', 'yellow').apply(null, arguments);
    };
    log.success = function() {
      return utils.logger('success', 'green').apply(null, arguments);
    };

    log.info = function() {
      return utils.logger('info', 'cyan').apply(null, arguments);
    };

    log.error = function() {
      return utils.logger('error', 'red').apply(null, arguments);
    };
    log.__proto__ = utils.log;
    return log;
  }
});

/**
 * Expose static `cli` method
 */

Update.cli = cli;

/**
 * Expose `update`
 */

module.exports = Update;
