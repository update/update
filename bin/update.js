#!/usr/bin/env node

var path = require('path');
var stamp = require('time-stamp');
var gray = require('ansi-gray');
var Runner = require('../lib/runner/runner')();
var utils = require('../lib/utils');
var argv = require('minimist')(process.argv.slice(2), {
  alias: {verbose: 'v'}
});

var cmd = utils.commands(argv);
var runner = new Runner(argv);

var task = cmd.list ? ['list', 'default'] : 'default';

runner.on('*', function (method, key, val) {
  console.log(method + ':', key, val);
});


if (argv.verbose) {
  runner.on('register', function(key) {
    utils.ok(utils.gray('registered'), 'updater', utils.cyan(key));
  });
}

runner.registerEach('update-*', {cwd: utils.gm});

runner.base.task('run', function (cb) {
  runner.run(cb);
});

runner.base.build(task, function (err) {
  if (err) console.error(err);
  timestamp('finished');
});

function timestamp(msg) {
  var time = ' ' + gray(stamp('HH:mm:ss.ms', new Date()));
  return console.log(time, msg, utils.green(utils.successSymbol));
}
