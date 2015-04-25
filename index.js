/*!
 * update <https://github.com/jonschlinkert/update>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var path = require('path');
var extend = require('lodash')._.extend;
var through = require('through2');
var Template = require('template');
var Task = require('orchestrator');
var vfs = require('vinyl-fs');

/**
 * Local dependencies
 */

var plugins = require('./lib/plugins');
var session = require('./lib/session');
var stack = require('./lib/stack');
var init = require('./lib/init');

/**
 * Initialize `Update`.
 *
 * ```js
 * var app = new Update();
 * ```
 *
 * @api public
 */

function Update(opts) {
  Template.call(this, opts);
  Task.call(this, opts);
  this.transforms = this.transforms || {};
  this.session = session;
  init.call(this, this);
}

extend(Update.prototype, Task.prototype);
Template.extend(Update.prototype);

/**
 * Glob patterns or filepaths to source files.
 *
 * ```js
 * app.src('*.js')
 * ```
 *
 * **Example usage**
 *
 * ```js
 * app.task('web-app', function() {
 *   app.src('templates/*')
 *     app.dest(process.cwd())
 * });
 * ```
 *
 * @param {String|Array} `glob` Glob patterns or file paths to source files.
 * @param {Object} `options` Options or locals to merge into the context and/or pass to `src` plugins
 * @api public
 */

Update.prototype.src = function(glob, opts) {
  return stack.src(this, glob, opts);
};

/**
 * Glob patterns or filepaths to templates stored in the
 * `./templates` directory of an updater.
 *
 * ```js
 * app.templates('*.js')
 * ```
 *
 * **Example usage**
 *
 * ```js
 * app.task('licenses', function() {
 *   app.templates('templates/licenses/*')
 *     app.dest(process.cwd())
 * });
 * ```
 *
 * @param {String|Array} `glob` Glob patterns or file paths to source files.
 * @param {Object} `options` Options or locals to merge into the context and/or pass to `src` plugins
 * @api public
 */

Update.prototype.templates = function(glob, opts) {
  return stack.templates(this, glob, opts);
};

/**
 * Specify a destination for processed files.
 *
 * ```js
 * app.dest('dist', {ext: '.xml'})
 * ```
 *
 * **Example usage**
 *
 * ```js
 * app.task('foo', function() {
 *   app.src('templates/*')
 *     app.dest('dist', {ext: '.xml'})
 * });
 * ```
 *
 * @param {String|Function} `dest` File path or rename function.
 * @param {Object} `options` Options or locals to merge into the context and/or pass to `dest` plugins
 * @api public
 */

Update.prototype.dest = function(dest, opts) {
  dest = path.resolve((opts && opts.cwd) || process.cwd(), dest);
  return stack.dest(this, dest, opts);
};

/**
 * Copy a `glob` of files to the specified `dest`.
 *
 * ```js
 * app.copy('assets/**', 'dist');
 * ```
 *
 * @param  {String|Array} `glob`
 * @param  {String|Function} `dest`
 * @return {Stream} Stream to allow doing additional work.
 */

Update.prototype.copy = function(glob, dest, opts) {
  return vfs.src(this, glob).pipe(vfs.dest(dest, opts));
};

/**
 * Define a task.
 *
 * ```js
 * app.task('docs', function() {
 *   app.src('*.js').pipe(app.dest('.'));
 * });
 * ```
 *
 * @param {String} `name`
 * @param {Function} `fn`
 * @api public
 */

Update.prototype.task = Update.prototype.add;

/**
 * Get the name of the currently running task. This is
 * primarily used inside plugins.
 *
 * ```js
 * app.gettask();
 * ```
 *
 * @return {String} `task` The currently running task.
 * @api public
 */

Update.prototype.gettask = function() {
  var name = this.session.get('task');
  return typeof name != 'undefined'
    ? 'task_' + name
    : 'file';
};

/**
 * Used in plugins to get a template from the current session.
 *
 * ```js
 * var template = getFile(id, file);
 * ```
 *
 * @return {String} `id` Pass the task-id from the current session.
 * @return {Object} `file` Vinyl file object. Must have an `id` property that matches the `id` of the session.
 * @api public
 */

Update.prototype.getFile = function(file) {
  var collection = this.inflections[this.gettask()];
  return this.views[collection][file.id];
};

/**
 * Set or get a generator function by `name`.
 *
 * ```js
 * // set an updater
 * app.updater('foo', require('updater-foo'));
 *
 * // get an updater
 * var foo = app.updater('foo');
 * ```
 * @param  {String} `name`
 * @param  {Function} `fn` The updater plugin function
 * @api public
 */

Update.prototype.updater = function(name, fn) {
  if (arguments.length === 1 && typeof name === 'string') {
    return this.updaters[name];
  }
  this.updaters[name] = fn;
  return this;
};

/**
 * Run an array of tasks.
 *
 * ```js
 * app.run(['foo', 'bar']);
 * ```
 *
 * @param {Array} `tasks`
 * @api private
 */

Update.prototype.run = function() {
  var tasks = arguments.length ? arguments : ['default'];

  process.nextTick(function () {
    this.start.apply(this, tasks);
  }.bind(this));
};

/**
 * Re-run the specified task(s) when a file changes.
 *
 * ```js
 * app.task('watch', function() {
 *   app.watch('docs/*.md', ['docs']);
 * });
 * ```
 *
 * @param  {String|Array} `glob` Filepaths or glob patterns.
 * @param  {Function} `fn` Task(s) to watch.
 * @api public
 */

Update.prototype.watch = function(glob, opts, fn) {
  if (Array.isArray(opts) || typeof opts === 'function') {
    fn = opts; opts = null;
  }

  if (!Array.isArray(fn)) vfs.watch(glob, opts, fn);
  return vfs.watch(glob, opts, function () {
    this.start.apply(this, fn);
  }.bind(this));
};

/**
 * Expose the `Update` class on `update.Update`
 */

Update.prototype.Update = Update;

/**
 * Expose our instance of `update`
 */

module.exports = new Update();
