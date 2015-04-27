/*!
 * update <https://github.com/jonschlinkert/update>
 *
 * Copyright (c) 2015, Jon Schlinkert.
 * Licensed under the MIT License.
 */

'use strict';

var path = require('path');
var through = require('through2');
var Template = require('template');
var toVinyl = require('to-vinyl');
var Task = require('orchestrator');
var vfs = require('vinyl-fs');
var _ = require('lodash');

/**
 * Local dependencies
 */

var plugins = require('./lib/plugins');
var session = require('./lib/session');
var stack = require('./lib/stack');
var utils = require('./lib/utils');
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
  this.session = session;
  init.call(this, this);
}

_.extend(Update.prototype, Task.prototype);
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

Update.prototype.plugin = function(name, fn) {
  if (!fn) return this.plugins[name];
  if (name && typeof name === 'object') {
    for (var key in name) {
      this.plugin(key, name[key]);
    }
  } else {
    this.plugins[name] = fn;
  }
  console.log(this)
  return this;
};

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
  return stack.templates(this, glob, opts)
    // .pipe(this.process(opts))
    .pipe(vfs.dest(dest, opts));
};

/**
 * Plugin for processing templates using any registered engine.
 * If this plugin is NOT used, engines will be selected based
 * on file extension.
 *
 * ```js
 * app.process();
 * ```
 *
 * @param  {String|Array} `glob`
 * @param  {String|Function} `dest`
 * @return {Stream} Stream to allow doing additional work.
 */

Update.prototype.process = function(locals, options) {
  locals = _.merge({id: this.getTask()}, this.cache.data, locals);
  locals.options = _.merge({}, this.options, options, locals.options);
  return plugins.process.call(this, locals, options);
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
 * Get the id from the current task. Used in plugins to get
 * the current session.
 *
 * ```js
 * var id = verb.getTask();
 * verb.views[id];
 * ```
 *
 * @return {String} `task` The currently running task.
 * @api public
 */

Update.prototype.getTask = function() {
  var name = this.session.get('task');
  return typeof name !== 'undefined'
    ? 'task_' + name
    : 'file';
};

/**
 * Get the collection name (inflection) of the given
 * template type.
 *
 * ```js
 * var collection = verb.getCollection('page');
 * // gets the `pages` collection
 * //=> {a: {}, b: {}, ...}
 * ```
 *
 * @return {String} `name` Singular name of the collection to get
 * @api public
 */

Update.prototype.getCollection = function(name) {
  var plural = this.inflections[name];
  return this.views[plural];
};

/**
 * Used in plugins to get a template from the current session.
 *
 * ```js
 * var views = app.getViews();
 * ```
 *
 * @return {String} `id` Pass the task-id from the current session.
 * @return {Object} `file` Vinyl file object. Must have an `id` property that matches the `id` of the session.
 * @api public
 */

Update.prototype.getViews = function() {
  var collection = this.inflections[this.getTask()];
  return this.views[collection];
};

/**
 * Get a template (file) from the current session in a stream.
 *
 * ```js
 * var file = app.getFile(file);
 * ```
 *
 * @return {Object} `file` Vinyl file object. Must have an `id` property that matches the `id` of the session.
 * @api public
 */

Update.prototype.getFile = function(file) {
  return this.getViews()[file.id];
};

/**
 * Get a template from the current session, convert it to a vinyl
 * file, and push it into the stream.
 *
 * ```js
 * app.pushToStream(file);
 * ```
 *
 * @param {Stream} `stream` Vinyl stream
 * @param {String} `id` Get the session `id` using `app.getTask()`
 * @api public
 */

Update.prototype.pushToStream = function(id, stream) {
  return utils.pushToStream(this.getCollection(id), stream, toVinyl);
};

/**
 * `taskFiles` is a session-context-specific getter that
 * returns the collection of files from the current `task`.
 *
 * ```js
 * var files = verb.taskFiles;
 * ```
 *
 * @name .taskFiles
 * @return {Object} Get the files from the current task.
 * @api public
 */

Object.defineProperty(Update.prototype, 'taskFiles', {
  configurable: true,
  enumerable: false,
  get: function () {
    return this.views[this.inflections[this.getTask()]];
  }
});

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
