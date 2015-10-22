#!/usr/bin/env node

var argv = require('minimist')(process.argv.slice(2));
var updaters = require('../lib/updaters');
var utils = require('../lib/utils');

updaters(argv).register('update-*', {
  cwd: utils.gm
});

updaters.base.task('run', function (cb) {
  updaters.run(cb);
});

updaters.base.build('default', function (err) {
  if (err) console.error(err);
});
