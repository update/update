#!/usr/bin/env node

require('set-blocking')(true);

var Update = require('..');
var commands = require('../lib/commands');
var utils = require('../lib/utils');
var argv = require('yargs-parser')(process.argv.slice(2), {
  alias: {
    add: 'a',
    config: 'c',
    configfile: 'f',
    global: 'g',
    remove: 'r'
  }
});

/**
 * Listen for errors
 */

Update.on('update.preInit', function(app) {
  app.on('error', function(err) {
    console.log(err.stack);
    process.exit(1);
  });
});

Update.on('update.postInit', function(app) {
  commands(app);
});

/**
 * Init CLI
 */

Update.cli(Update, argv, function(err, app) {
  if (err) return console.log(err);
  var tasks = resolveTasks(app, argv);

  app.cli.process(argv, function(err) {
    if (err) app.emit('error', err);

    app.update(tasks, function(err) {
      if (err) return console.log(err);
      app.emit('done');
      process.exit();
    });
  });
});

/**
 * Get the updaters to run from user config
 */

function resolveTasks(app, argv) {
  var tasks = utils.arrayify(argv._);
  if (tasks.length && utils.contains(['help', 'new', 'default'], tasks)) {
    app.enable('silent');
    return tasks;
  }

  if (tasks.length && !utils.contains(['help', 'new', 'default'], tasks)) {
    return tasks;
  }

  tasks = app.getUpdaters(argv.add, argv);
  if (!tasks || !tasks.length) {
    return ['init'];
  }
  return tasks;
};
