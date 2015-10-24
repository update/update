#!/usr/bin/env node

var argv = require('minimist')(process.argv.slice(2));
var multi = require('../lib/multi')();
var utils = require('../lib/utils');

var cmd = utils.commands(argv);
var cli = multi(argv);

var task = cmd.list ? 'list' : 'default';

cli.on('*', function (method, key, val) {
  console.log(method + ':', key, val);
});
cli.on('register', function(key) {
  console.log('registered ', utils.yellow(key));
});

cli.register('update-*', {cwd: utils.gm});

cli.base.task('run', function (cb) {
  cli.run(cb);
});

cli.base.build(task, function (err) {
  if (err) console.error(err);
  utils.ok('Finished (see ');
});
