'use strict';

var utils = require('./lib/');
// var Update = require('./');
// var update = new Update();

var updaters = utils.matchGlobal({
  pattern: 'updater-*',
  filename: 'updatefile.js',
  fn: function() {}
});

// updaters.forEach(function (fp) {
//   var updater = require(fp);
//   updater(update);
// });

console.log(updaters)
