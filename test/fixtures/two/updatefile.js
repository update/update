'use strict';

var Update = require('../../..');
var update = new Update();

update.task('default', function() {});
update.task('a', function() {});
update.task('b', function() {});
update.task('c', function() {});

update.register('foo', function(app) {
  app.task('x', function() {});
  app.task('y', function() {});
  app.task('z', function() {});
});

/**
 * Expose this instance of `Update`
 */

module.exports = update;
