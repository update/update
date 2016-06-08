'use strict';

var util = require('util');
var wrap = require('word-wrap');
var size = require('window-size');
var choose = require('gulp-choose-files');
var through = require('through2');
var gm = require('global-modules');

module.exports = function(app, base) {

  /**
   * Prompts the user to select the updaters to run with the `update` command. Use `--add` to
   * add addtional updaters, and `--remove` to remove them.
   *
   * ```sh
   * $ update defaults:help
   * # aliased as
   * $ update help
   * ```
   * @name help
   * @api public
   */

  app.task('init', { silent: true }, function() {
    var updaters = [];
    return app.src('updater-*', {cwd: gm})
      .pipe(through.obj(function(file, enc, next) {
        file.basename = file.basename.split('updater-').join('');
        next(null, file);
      }))
      .pipe(choose({message: 'Choose the updaters to run with the `update` command:'}))
      .pipe(through.obj(function(file, enc, next) {
        updaters.push(file.basename);
        next();
      }, function(next) {
        save(app, updaters);
        next();
      }));
  });

  /**
   * Display a help menu of available commands and flags.
   *
   * ```sh
   * $ update defaults:help
   * # aliased as
   * $ update help
   * ```
   * @name help
   * @api public
   */

  app.task('help', { silent: true }, function(cb) {
    base.cli.process({ help: true }, cb);
  });

  /**
   * Show the list of updaters that are registered to run on the current project.
   *
   * ```sh
   * $ update defaults:show
   * # aliased as
   * $ update show
   * ```
   * @name show
   * @api public
   */

  app.task('show', { silent: true }, function(cb) {
    base.cli.process({ help: true }, cb);
  });

  /**
   * Default task for the built-in `defaults` generator.
   *
   * ```sh
   * $ update help
   * ```
   * @name help
   * @api public
   */

  app.task('default', { silent: true }, ['help']);
};

/**
 * Save answers to `init` prompts
 */

function save(app, list) {
  if (!list.length) {
    console.log(' no updaters were saved.');
    return;
  }

  if (app.options.c || app.options.config) {
    app.pkg.set('update.updaters', list);
  } else {
    app.store.set('updaters', list);
  }

  var suffix = list.length > 1 ? 'updaters are' : 'updater is';
  var gray = app.log.gray;
  var cyan = app.log.cyan;
  var bold = app.log.bold;
  var configname = 'updater';
  var appname = 'update';
  var command = 'update';

  var msg = gray('\n  ---')
      + '\n'
      + `\n  ${app.log.green(app.log.check)}  Done, your default ${suffix}:`
      + '\n'
      + cyan(`\n    · ` + list.join('\n    · '))
      + '\n'
      + '\n'
      + gray('  ---')
      + '\n'
      + '\n'
      + '  To make changes, run: ' + bold(`$ ${command} init`)
  console.log(msg.split('\n').join('\n'));
  console.log();
}
