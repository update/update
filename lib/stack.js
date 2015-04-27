'use strict';

/**
 * Module dependencies.
 */

var path = require('path');
var vfs = require('vinyl-fs');
var _ = require('lodash');

/**
 * Local dependencies
 */

var plugins = require('./plugins');
var session = require('./session');
var utils = require('./utils');

/**
 * Create a plugin stack to be run by `src` or `dest`
 */

/**
 * Default `src` plugins to run.
 */

exports.src = function (app, glob, opts) {
  opts = _.merge({}, app.options, opts);
  opts.cwd = app.get('updater.cwd');
  session.set('src', opts);

  return utils.createStack(app, [
    vfs.src(glob, opts),
    plugins.init.call(app, opts)
  ]);
};

/**
 * Default `template` plugins to run.
 */

exports.templates = function (app, glob, opts) {
  opts = _.merge({}, app.options, opts);
  opts.cwd = app.get('updater.cwd');
  session.set('templates', opts);

  return utils.createStack(app, [
    vfs.src(glob, opts),
    plugins.init.call(app, opts)
  ]);
};

/**
 * Default `dest` plugins to run.
 */

exports.dest = function (app, dest, opts) {
  var srcOpts = session.get('src') || session.get('templates') || {};
  opts = _.merge({}, app.options, srcOpts, opts);
  opts.cwd = process.cwd();
  dest = path.resolve(opts.cwd, dest);

  return utils.createStack(app, [
    plugins.dest.call(app, dest, opts, opts.locals),
    plugins.render.call(app, opts, opts.locals),
    vfs.dest(dest, opts)
  ]);
};
