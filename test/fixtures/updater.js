'use strict';

module.exports = function(app) {
  app.register('updater-aaa', function(app) {
    app.task('default', function(cb) {
      console.log('update > default');
      cb();
    });

    app.register('sub', function(sub) {
      sub.task('default', function(cb) {
        console.log('aaa > sub > default');
        cb();
      });

      sub.register('bbb', function(bbb) {
        bbb.task('default', function(cb) {
          console.log('aaa > sub > bbb > default');
          cb();
        });
      });
    });
  });

  app.register('updater-abc', 'test/fixtures/generators/a/generator.js');

  app.register('updater-bbb', function(app) {
    app.task('default', function(cb) {
      app.update('aaa.sub.bbb', 'default', cb);
    });
  });

  app.register('updater-ccc', function(app) {
    app.task('default', function(cb) {
      app.update('abc', 'default', cb);
    });
  });

  app.register('updater-ddd', function(app) {
    app.task('default', function(cb) {
      app.update('abc.docs', 'x', cb);
    });
  });

  app.update('aaa.sub', ['default'], function(err) {
    if (err) throw err;
    console.log('done');
  });
};
