'use strict';

var Generate = require('../../..');
var update = new Generate();

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
 * Expose this instance of `Generate`
 */

module.exports = update;
