#!/usr/bin/env node

require('set-blocking')(true);

var Update = require('..');
var commands = require('../lib/commands');
var utils = require('../lib/utils');
var argv = require('yargs-parser')(process.argv.slice(2), utils.opts);

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

  app.cli.process(argv, function(err) {
    if (err) app.emit('error', err);

    var tasks = argv._.length ? argv._ : ['default'];
    if (app.updatefile !== true || argv.run) {
      tasks = Update.resolveTasks(app, argv);
    }

    app.log.success('running:', tasks);
    app.update(tasks, function(err) {
      if (err) return console.log(err);
      app.emit('done');
      process.exit();
    });
  });
});
