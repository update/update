#!/usr/bin/env node

var async = require('async');
var runtimes = require('composer-runtimes');
var argv = require('minimist')(process.argv.slice(2));
var builtins = require('../lib/tasks');
var utils = require('../lib');
var update = require('..');
var base = update(argv);

var updaters = argv._.length ? argv._ : ['base'];

base.task('default', function (cb) {
  console.log(utils.tree(base.updaters));
  cb();
});

base.on('error', function (err) {
  if (/Invalid task/.test(err.message)) {
    console.error('cannot find task "default"');
  }
});

utils.matchGlobal('update-*')
  .forEach(function (fp) {
    var mod = utils.resolveModule(fp, update);
    var name = utils.getName(fp);
    var app = mod(base.options)
      .set('path', fp)
      .use(runtimes({
        displayName: function(key) {
          return name + ':' + key;
        }
      }));
    require(utils.updatefile(fp))(app, base);
    base.updater(name, app);
  });


var proxy = update();
for (var key in builtins) {
  proxy.task(key, builtins[key](proxy));
}
base.updater('base', proxy);


/**
 * Updaters to run
 */

async.eachSeries(updaters, function(arg, next) {
  base.emit('base.build');

  var args = arg.split('.').filter(Boolean);
  var tasks = ['default'];
  if (args[1]) {
    tasks = args[1].split(',');
  }

  var app = base.updater(args[0]);
  // var name = args[0];
  // var app = name !== 'base'
  //   ? base.updater(name)
  //   : base;

  app.build(tasks, function (err) {
    if (err) {
      next(err);
      return;
    }
    next();
  });

}, function (err) {
  if (err) {
    base.emit('error', err);
  }
});
