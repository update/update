'use strict';

/**
 * Module dependencies.
 */

var through = require('through2');
var sessionify = require('sessionify');
var vfs = require('vinyl-fs');
var es = require('event-stream');
var _ = require('lodash');

/**
 * Local dependencies
 */

var plugins = require('./plugins');
var session = require('./session');

/**
 * Create a plugin stack to be run by `src` or `dest`
 */

function createStack(app, plugins) {
  var stack = [];
  plugins.forEach(function (plugin) {
    if (plugin == null) {
      stack.push(through.obj());
    } else {
      stack.push(plugin);
    }
  });
  var res = es.pipe.apply(es, stack);
  return sessionify(res, session);
}

/**
 * Default `src` plugins to run.
 */

exports.src = function (app, glob, opts) {
  opts = _.extend({}, app.options, opts);
  opts.cwd = app.get('updater.cwd');
  session.set('src', opts);

  return createStack(app, [
    vfs. src(glob, opts),
    plugins.init.call(app, opts)
  ]);
};

/**
 * Default `template` plugins to run.
 */

exports.templates = function (app, glob, opts) {
  opts = _.extend({}, app.options, opts);
  opts.cwd = app.get('updater.cwd') + '/templates';
  session.set('templates', opts);

  return createStack(app, [
    vfs.src(glob, opts),
    plugins.init.call(app, opts)
  ]);
};

/**
 * Default `dest` plugins to run.
 */

exports.dest = function (app, dest, options) {
  var srcOpts = session.get('src') || session.get('templates') || {};
  var opts = _.extend({}, app.options, srcOpts, options);
  var locals = opts.locals;

  return createStack(app, [
    plugins.dest.call(app, dest, opts),
    plugins.render.call(app, opts, locals),
    vfs.dest(dest, opts)
  ]);
};
