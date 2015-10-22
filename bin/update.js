#!/usr/bin/env node

var argv = require('minimist')(process.argv.slice(2));
var updaters = require('../lib/updaters');
var utils = require('../lib/utils');

var update = updaters(argv);

update.register('update-*', {
  cwd: utils.gm
});

update.base.task('run', function (cb) {
  update.run(cb);
});

update.base.build('default', function (err) {
  if (err) console.error(err);
});
