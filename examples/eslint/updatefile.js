'use strict';

module.exports = function(app) {
  app.task('foo', function(cb) {
    app.update('bar', cb);
  });

  app.register('foo', function(gen) {
    gen.task('default', function(cb) {
      console.log(gen.name, 'task >', this.name);
      cb();
    });
  });

  app.task('default', function(cb) {
    console.log(app.name, 'task >', this.name);
    cb();
  });
};
