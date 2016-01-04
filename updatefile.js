'use strict';

/**
 * temporary test code
 */

module.exports = function (app) {
  app.task('lint', require('./lib/tasks/lint'));
};
