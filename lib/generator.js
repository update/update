'use strict';

module.exports = function(app, base, env) {
  app.task('default', function(cb) {
    console.log('lib/updater > default');
    cb();
  });
};
