#!/usr/bin/env node

var path = require('path');
var utils = require('../lib/utils');
var errors = require('./errors');
var update = require('..');
var Env = update.Env;

var argv = require('minimist')(process.argv.slice(2), {
  alias: {
    help: 'h',
    verbose: 'v'
  }
});

function run(cb) {
  var cwd = process.cwd();
  var root = cwd;

  /**
   * Set the working directory
   */

  if (argv.cwd && cwd !== path.resolve(argv.cwd)) {
    process.chdir(argv.cwd);
    cwd = process.cwd();
    utils.timestamp('cwd changed to ' + utils.colors.yellow('~/' + argv.cwd));
  }

  /**
   * Create the base "update" instance
   */

  var baseDir = path.resolve(__dirname, '..');
  var baseEnv = createEnv('updatefile.js', baseDir);

  // instantiate
  var base = update();
  base.env = baseEnv;

  // set the updater function on the instance
  base.fn = require('../updatefile.js');

  /**
   * Get the updatefile.js to use
   */

  var updatefile = path.resolve(process.cwd(), 'updatefile.js');
  if (!utils.exists(updatefile)) {
    if (utils.isEmpty(process.cwd())) {
      argv._.unshift('defaults:init');
      utils.logConfigfile(baseDir, 'updatefile.js');
      base.fn.call(base, base, base, base.env);
      cb(null, base);
      return;
    }

    updatefile = path.resolve(__dirname, '../updatefile.js');
    cwd = path.dirname(updatefile);
  }

  /**
   * Create the user's "update" instance
   */

  var fn = require(updatefile);
  var env = createEnv('updatefile.js', cwd);
  var app;

  function register(app, env, fn) {
    app.option(argv);
    app.register('base', base.fn, base.env);
    app.env = env;
    if (fn) app.fn = fn;
  }

  if (typeof fn === 'function') {
    app = update();
    register(app, env, fn);
    fn.call(app, app, base, env);

  } else {
    app = fn;
    register(app, env);
  }

  /**
   * Process command line arguments
   */

  var args = utils.processArgv(app, argv);
  app.set('argv', args);

  /**
   * Process configuration settings defined on the
   * `update` property in package.json
   */

  app.config.process(app.get('env.user.pkg.update'));

  /**
   * Show path to updatefile
   */

  utils.logConfigfile(root, updatefile);

  /**
   * Support `--emit` for debugging
   *
   * Example:
   *   $ --emit data
   */

  if (argv.emit && typeof argv.emit === 'string') {
    app.on(argv.emit, console.error.bind(console));
  }

  /**
   * Listen for generator configs, and register them
   * as they're emitted
   */

  app.env.on('config', function(name, env) {
    app.register(name, env.config.fn, env);
  });

  /**
   * Resolve update generators
   */

  app.env
    .resolve('updater-*/updatefile.js', {
      configfile: 'updatefile.js',
      cwd: utils.gm
    })
    .resolve('generate-*/generator.js', {
      configfile: 'generator.js',
      cwd: utils.gm
    });

  cb(null, app);
}

/**
 * Run
 */

run(function(err, app) {
  if (err) handleError(err);

  if (!app) {
    process.exit(0);
  }

  /**
   * Listen for errors
   */

  app.on('error', function(err) {
    console.log(err);
  });

  /**
   * Run tasks
   */

  app.build(argv, function(err) {
    if (err) {
      console.error(err.stack);
      process.exit(1);
    }
    utils.timestamp('finished ' + utils.success());
    process.exit(0);
  });
});

/**
 * Creat a new `env` object
 */

function createEnv(configfile, cwd) {
  var env = new Env(configfile, 'update', cwd);;
  env.module.path = utils.tryResolve('update');
  return env;
}

/**
 * Handle CLI errors
 */

function handleError(err) {
  if (typeof err === 'string' && errors[err]) {
    console.error(errors[err]);
  } else {
    console.error(err);
  }
  process.exit(1);
}
