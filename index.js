'use strict';

var typeOf = require('kind-of');
var es = require('event-stream');
var through = require('through2');
var Template = require('template');
var toVinyl = require('to-vinyl');
var Task = require('orchestrator');
var tutils = require('template-utils')._;
var vfs = require('vinyl-fs');
var _ = require('lodash');

var render = require('template-render');
var init = require('template-init');

var plugins = require('./lib/plugins');
var session = require('./lib/session');
var stack = require('./lib/stack');
var utils = require('./lib/utils');
var init = require('./lib/init');

/**
 * Initialize `App`
 *
 * @param {Object} `context`
 * @api private
 */

function App() {
  Template.apply(this, arguments);
  Task.apply(this, arguments);
  this.session = session;
  this.plugins = {};
  init(this);
}

_.extend(App.prototype, Task.prototype);
Template.extend(App.prototype);

/**
 * Register a plugin by `name`
 *
 * @param  {String} `name`
 * @param  {Function} `fn`
 * @api public
 */

App.prototype.plugin = function(name, fn) {
  if (arguments.length === 1) {
    return this.plugins[name];
  }
  if (typeof fn === 'function') {
    fn = fn.bind(this);
  }
  this.plugins[name] = fn;
  return this;
};

/**
 * Create a plugin pipeline from an array of plugins.
 *
 * @param  {Array} `plugins` Each plugin is a function that returns a stream, or the name of a registered plugin.
 * @param  {Object} `options`
 * @return {Stream}
 * @api public
 */

App.prototype.pipeline = function(plugins, options) {
  var res = [];
  for (var i = 0; i < plugins.length; i++) {
    var val = plugins[i];
    if (typeOf(val) === 'function') {
      res.push(val.call(this, options));
    } else if (typeOf(val) === 'object') {
      res.push(val);
    } else if (this.plugins.hasOwnProperty(val) && !this.isFalse('plugin ' + val)) {
      res.push(this.plugins[val].call(this, options));
    } else {
      res.push(through.obj());
    }
  }
  return es.pipe.apply(es, res);
};

/**
 * Glob patterns or filepaths to source files.
 *
 * ```js
 * app.src('*.js')
 * ```
 *
 * @param {String|Array} `glob` Glob patterns or file paths to source files.
 * @param {Object} `options` Options or locals to merge into the context and/or pass to `src` plugins
 * @api public
 */

App.prototype.src = function(glob, opts) {
  opts = _.merge({}, this.options, opts);
  session.set('src', opts);
  var app = this;

  return this.combine([
    vfs.src(glob, opts),
    app.plugin('init')(app)
  ], opts);
};

/**
 * Glob patterns or filepaths to templates stored in the
 * `./templates` directory of an updater.
 *
 * ```js
 * app.templates('*.js')
 * ```
 *
 * @param {String|Array} `glob` Glob patterns or file paths to source files.
 * @param {Object} `options` Options or locals to merge into the context and/or pass to `src` plugins
 * @api public
 */

App.prototype.templates = function(glob, opts) {
  return stack.templates(this, glob, opts);
};

/**
 * Specify a destination for processed files.
 *
 * ```js
 * app.dest('dist', {ext: '.xml'})
 * ```
 *
 * @param {String|Function} `dest` File path or rename function.
 * @param {Object} `options` Options or locals to pass to `dest` plugins
 * @api public
 */

App.prototype.dest = function(dest, opts) {
  var srcOpts = session.get('src') || {};
  opts = _.merge({}, this.options, srcOpts, opts);
  var app = this;

  return this.combine([
    app.plugin('paths')(dest, opts),
    app.plugin('lint'),
    app.plugin('render')(opts),
    app.plugin('dest')(dest, opts),
  ], opts);
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

App.prototype.copy = function(glob, dest, opts) {
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

App.prototype.process = function(locals, options) {
  locals = _.merge({id: this.getTask()}, this.cache.data, locals);
  locals.options = _.merge({}, this.options, options, locals.options);
  return plugins.process.call(this, locals, options);
};

/**
 * Define a task.
 *
 * ```js
 * app.task('docs', function() {
 *   app.src(['foo.js', 'bar/*.js'])
 *     .pipe(app.dest('./'));
 * });
 * ```
 *
 * @param {String} `name`
 * @param {Function} `fn`
 * @api public
 */

App.prototype.task = App.prototype.add;

/**
 * Get the name of the current task-session. This is
 * used in plugins to lookup data or views created in
 * a task.
 *
 * ```js
 * var id = app.getTask();
 * var views = app.views[id];
 * ```
 *
 * @return {String} `task` The name of the currently running task.
 * @api public
 */

App.prototype.getTask = function() {
  var name = this.session.get('task');
  return typeof name !== 'undefined'
    ? 'task_' + name
    : 'taskFile';
};

/**
 * Get a view collection by its singular-form `name`.
 *
 * ```js
 * var collection = app.getCollection('page');
 * // gets the `pages` collection
 * //=> {a: {}, b: {}, ...}
 * ```
 *
 * @return {String} `name` Singular name of the collection to get
 * @api public
 */

App.prototype.getCollection = function(name) {
  if (typeof name === 'undefined') {
    name = this.getTask();
  }

  if (this.views.hasOwnProperty(name)) {
    return this.views[name];
  }

  name = this.inflections[name];
  return this.views[name];
};

/**
 * Get a file from the current session.
 *
 * ```js
 * var file = app.getFile(file);
 * ```
 *
 * @return {Object} `file` Vinyl file object. Must have an `id` property.
 * @api public
 */

App.prototype.getFile = function(file, id) {
  return this.getCollection(id)[file.id];
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

App.prototype.pushToStream = function(id, stream) {
  return tutils.pushToStream(this.getCollection(id), stream, toVinyl);
};

/**
 * `taskFiles` is a session-context-specific getter that
 * returns the collection of files from the currently running `task`.
 *
 * ```js
 * var taskFiles = app.taskFiles;
 * ```
 *
 * @name .taskFiles
 * @return {Object} Get the files from the currently running task.
 * @api public
 */

Object.defineProperty(App.prototype, 'taskFiles', {
  configurable: true,
  enumerable: true,
  get: function () {
    return this.getCollection();
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

App.prototype.updater = function(name, fn) {
  if (arguments.length === 1 && typeof name === 'string') {
    return this.updaters[name];
  }
  this.updaters[name] = fn;
  return this;
};

/**
 * Register a plugin that can be arbitrarily pushed into a
 * plugin stack.
 *
 * ```js
 * app.plugin('foo', require('plugin-foo'));
 * ```
 *
 * @param {String} `name` Plugin name
 * @param {Function} `fn` Plugin function, must return a vinyl stream.
 * @api public
 */

App.prototype.plugin = function(name, fn) {
  if (arguments.length === 1 && typeof name === 'string') {
    return this.plugins[name];
  }
  this.plugins[name] = fn;
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

App.prototype.run = function() {
  var tasks = arguments.length ? arguments : ['default'];
  process.nextTick(function () {
    this.start.apply(this, tasks);
  }.bind(this));
};

/**
 * Wrapper around Task._runTask to enable `sessions`.
 *
 * @param  {Object} `task` Task to run
 * @api private
 */

App.prototype._runTask = function(task) {
  var app = this;
  app.session.run(function () {
    app.session.set('task', task.name);
    Task.prototype._runTask.call(app, task);
  });
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

App.prototype.watch = function(glob, opts, fn) {
  if (Array.isArray(opts) || typeof opts === 'function') {
    fn = opts; opts = null;
  }
  if (!Array.isArray(fn)) return vfs.watch(glob, opts, fn);
  return vfs.watch(glob, opts, function () {
    this.start.apply(this, fn);
  }.bind(this));
};

/**
 * Expose the `App` class on `update.App`
 */

App.prototype.App = App;

/**
 * Expose our instance of `update`
 */

module.exports = new App();
