#!/usr/bin/env node

var path = require('path');
var chalk = require('chalk');
var prettyTime = require('pretty-hrtime');
var completion = require('../lib/utils/completion');
var taskTree = require('../lib/utils/task-tree');
var app = require('..');

var argv = require('minimist')(process.argv.slice(2));
var stack = argv._;
var len = stack.length, i = 0;

while (len--) {
  var name = stack[i++];
  var plugin = app.updater(name);
  console.log(plugin);
  // app.updater(name);
}

var name = stack[0];

var updater = typeof name !== 'undefined'
  ? app.updater(name)
  : exit(0);

  // console.log(updater)
var fp = updater.updatefile;

if (fp) {
  var cwd = path.dirname(fp);
  var instance = require(fp);

  instance.set('updater.cwd', cwd);
  instance.set('updater.templates', cwd + '/templates');
  instance.emit('init');
  instance.emit('loaded');
  instance.extend('argv', argv);

  process.nextTick(function () {
    instance.start.apply(instance, ['default']);
  }.bind(instance));
}

// exit with 0 or 1
var failed = false;
process.once('exit', function(code) {
  if (code === 0 && failed) {
    exit(1);
  }
});

app.on('last', function () {
  var args;
  if (argv.set) {
    args = argv.set.split('=');
    app.store.set.apply(app.store, args);
  }

  if (argv.has) {
    args = argv.has.split('=');
    app.store.has.apply(app.store, args);
  }

  if (argv.omit) {
    args = argv.omit.split('=');
    app.store.omit.apply(app.store, args);
  }

  if (argv.del) {
    app.store.delete({force: true});
  }
});

app.on('err', function () {
  failed = true;
});

app.on('task_start', function (e) {
  console.log('starting', '\'' + chalk.cyan(e.task) + '\'');
});

app.on('task_stop', function (e) {
  var time = prettyTime(e.hrDuration);
  console.log('finished', '\'' + chalk.cyan(e.task) + '\'', 'after', chalk.magenta(time));
});

app.on('task_err', function (e) {
  var msg = formatError(e);
  var time = prettyTime(e.hrDuration);
  console.log(chalk.cyan(e.task), chalk.red('errored after'), chalk.magenta(time));
  console.log(msg);
});

app.on('task_not_found', function (err) {
  console.log(chalk.red('task \'' + err.task + '\' is not in your updatefile'));
  console.log('please check the documentation for proper updatefile formatting');
  exit(1);
});

function logTasks(env, instance) {
  var tree = taskTree(instance.tasks);
  tree.label = 'Tasks for ' + tildify(instance.module);
  archy(tree).split('\n').forEach(function (v) {
    if (v.trim().length === 0) {
      return;
    }
    console.log(v);
  });
}

// format orchestrator errors
function formatError(e) {
  if (!e.err) {
    return e.message;
  }

  // PluginError
  if (typeof e.err.showStack === 'boolean') {
    return e.err.toString();
  }

  // normal error
  if (e.err.stack) {
    return e.err.stack;
  }

  // unknown (string, number, etc.)
  return new Error(String(e.err)).stack;
}


// fix stdout truncation on windows
function exit(code) {
  if (process.platform === 'win32' && process.stdout.bufferSize) {
    process.stdout.once('drain', function() {
      process.exit(code);
    });
    return;
  }
  process.exit(code);
}

if (!argv._.length) {
  app.emit('loaded');
}
