'use strict';

var fs = require('fs');
var path = require('path');
var pkg = require(path.resolve(__dirname, '../package'));

/**
 * Lazily required module dependencies
 */

var utils = require('lazy-cache')(require);
var fn = require;
require = utils;

// type utils
require('for-own');

// engine/template utiles
require('data-store', 'store');
require('global-modules', 'gm');
require('look-up', 'lookup');
require('micromatch', 'mm');
require('parser-front-matter', 'matter');
require('question-cache', 'questions');
require('extend-shallow', 'extend');
require('resolve-dir', 'resolve');
require('project-name', 'project');
require('union-value', 'union');
require('set-value', 'set');
require('get-value', 'get');

/**
 * Colors
 */

require('ansi-yellow', 'yellow');
require('ansi-green', 'green');
require('ansi-cyan', 'cyan');
require('ansi-red', 'red');
require = fn;

/**
 * CLI utils
 */

utils.identity = function(val) {
  return val;
};

utils.arrayify = function(val) {
  return Array.isArray(val) ? val : [val];
};

utils.toArray = function(val) {
  if (Array.isArray(val)) return val;
  if (val && val.length) {
    return [].slice.call(val);
  }
};

utils.error = function() {
  var args = utils.toArray(arguments);
  args.unshift(utils.red('[update-cli] Error:'));
  console.error.apply(console, args);
};

utils.npm = function(name) {
  return utils.tryRequire(name) || utils.tryRequire(path.resolve(name));
};

utils.exists = function(fp) {
  return fs.existsSync(fp);
};

/**
 * Create a global path for the given value
 */

utils.toGlobalPath = function(fp) {
  return '@/' + path.basename(fp, path.extname(fp));
};

/**
 * Create a global path for the given value
 */

utils.findGlobal = function(pattern) {
  return utils.lookup(pattern, { cwd: utils.gm });
};

/**
 * Create a global path for the given value
 */

utils.listGlobal = function() {
  return fs.readdirSync(utils.gm);
};

/**
 * Get the resolved path to an "updatefile.js"
 */

utils.updatefile = function(dir) {
  return path.join(dir, 'updatefile.js');
};

/**
 * Create a global path for the given value
 */

utils.matchGlobal = function(pattern, filename) {
  var isMatch = utils.mm.matcher(pattern);
  var files = utils.listGlobal();
  var len = files.length, i = -1;
  var res = [];
  while (++i < len) {
    var name = files[i];
    if (name === 'update-next') continue;
    var fp = path.join(utils.gm, name);
    if (isMatch(fp) || isMatch(name)) {
      res.push(path.join(fp, filename || ''));
    }
  }
  return res;
};

/**
 * Get the name of an updater
 */

utils.getName = function(fp) {
  return utils.project(fp).split(/[-\W_.]+/).pop();
};

/**
 * Resolve the correct updater module to instantiate.
 * If `update` exists in `node_modules` of the cwd,
 * then that will be used to create the instance,
 * otherwise this module will be used.
 */

utils.resolveModule = function(dir, update) {
  dir = path.join(dir, 'node_modules/', pkg.name);
  if (utils.exists(dir)) {
    return require(path.resolve(dir));
  }
  return update;
};

/**
 * Print a tree of "updaters" and their tasks
 *
 * ```js
 * utils.tree(updaters);
 * ```
 */

utils.tree = function(updaters) {
  var res = '';
  for (var key in updaters) {
    res += utils.cyan(key) + '\n';
    for (var task in updaters[key].tasks) {
      res += ' - ' + task + '\n';
    }
  }
  return res;
};

/**
 * Try to require a file
 */

utils.tryRequire = function(name) {
  try {
    return require(name);
  } catch(err) {
    console.log(err);
  }
  return null;
};

/**
 * Try to read a file
 */

utils.tryRead = function(fp) {
  try {
    return fs.readFileSync(fp);
  } catch(err) {}
  return null;
};

/**
 * Restore `require`
 */

require = fn;

/**
 * Expose `utils`
 */

module.exports = utils;


/**
 * Expose utils
 */

module.exports = utils;
