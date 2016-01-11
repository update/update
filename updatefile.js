'use strict';

var fs = require('fs');
var path = require('path');
var utils = require('./lib/utils');

/**
 * This is the defalt updater, it can also be used
 * to extend other updaters.
 */

module.exports = function(update, base, env) {
  var async = utils.async;
  var glob = utils.glob;

  /**
   * TODO: User help and defaults
   */

  update.register('defaults', function(app) {
    app.task('init', function(cb) {
      app.questions.set('init', 'Want to generate a new project?');
      app.ask('init', { force: true }, function(err, answers) {
        if (err) return cb(err);

        if (answers.init === 'y') {
          var generate = require('generate')();
          generate.fn(update, update, update.env);
          update.build(['prompt', 'files', 'write'], cb);
        } else {
          cb();
        }
      });
    });

    app.task('help', function(cb) {
      console.log('Would you like to choose a updater to run?');
      console.log('(implement me!)')
      cb();
    });

    app.task('error', function(cb) {
      console.log('update > error (implement me!)');
      cb();
    });
  });

  /**
   * Data store tasks
   */

  update.register('store', function(app) {
    app.task('del', function(cb) {
      update.store.del({ force: true });
      console.log('deleted data store');
      cb();
    });
  });

  /**
   * User prompts
   */

  update.task('prompt', function(cb) {
    var pkg = env.config.pkg;

    if (!pkg || env.user.isEmpty || env.argv.raw.init) {
      forceQuestions(update);
    }

    update.questions.setData(pkg || {});
    update.ask({ save: false }, function(err, answers) {
      if (err) return cb(err);
      if (!pkg) answers = {};

      answers.name = answers.name || utils.project();
      answers.varname = utils.namify(answers.name);
      update.set('answers', answers);
      cb();
    });
  });

  /**
   * Default configuration settings
   */

  update.task('defaultConfig', function(cb) {
    update.lazyIgnores();
    update.engine(['md', 'text'], require('engine-base'));
    update.data({year: new Date().getFullYear()});
    cb();
  });

  /**
   * Load files to be rendered
   */

  update.task('files', ['defaultConfig'], function(cb) {
    var ignore = update.get('cache.ignores');
    update.files(['*'], {cwd: update.cwd, dot: true, ignore: ignore});
    cb();
  });

  /**
   * Write files to disk
   */

  update.task('write', function() {
    var data = update.get('answers');
    return update.toStream('files')
      // .pipe(update.renderFile('text', data))
      // .pipe(update.dest(rename(dest)));
  });

  /**
   * Generate a new project
   */

  update.task('updaters', ['files']);

  /**
   * Default task to be run
   */

  update.task('default', function(cb) {
    update.build('files', cb);
  });
};

function forceQuestions(update) {
  update.questions.options.forceAll = true;
}
