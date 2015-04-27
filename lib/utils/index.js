'use strict';

/**
 * Module dependencies
 */

var fs = require('fs');
var path = require('path');
var chalk = require('chalk');
var async = require('async');
var relative = require('relative');
var mm = require('micromatch');

/**
 * File cache
 */

var cache = {};

/**
 * Expose `utils`
 */

var utils = module.exports = require('export-files')(__dirname);


/**
 * Run middleware in series
 */

utils.series = function series(fns) {
  return function (file, cb) {
    async.eachSeries(fns, function (fn, next) {
      fn(file, next);
    }, cb);
  };
};

utils.pushToStream = function pushToStream(collection, stream, fn) {
  var i = 0;
  for (var key in collection) {
    if (collection.hasOwnProperty(key)) {
      var file = collection[key];
      stream.push(fn ? fn(file, i++) : file);
    }
  }
};

/**
 * Cast `val` to an array.
 */

utils.arrayify = function arrayify(val) {
  var isArray = Array.isArray(val);
  if (typeof val !== 'string' && !isArray) {
    throw new Error('utils.arrayify() expects a string or array.');
  }
  return isArray ? val : [val];
};

/**
 * Try to require a file, fail silently. Encapsulating try-catches
 * also helps with v8 optimizations.
 *
 * @api private
 */

utils.tryRequire = function tryRequire(fp) {
  if (typeof fp === 'undefined') {
    throw new Error('utils.tryRequire() expects a string.');
  }

  var key = 'tryRequire:' + fp;
  if (cache.hasOwnProperty(key)) {
    return cache[key];
  }

  try {
    return (cache[key] = require(path.resolve(fp)));
  } catch(err) {
    console.error(chalk.red('verb cannot find'), chalk.bold(fp), err);
  }
  return {};
};

/**
 * Recursively try to read directories.
 */

utils.tryReaddirs = function tryReaddirs(dir, ignored) {
  if (typeof dir === 'undefined') {
    throw new Error('utils.tryReaddirs() expects a string.');
  }

  var files = utils.tryReaddir(dir);
  var res = [], len = files.length, i = 0;

  var isIgnored = utils.matchesAny(ignored);
  while (len--) {
    var fp = relative(path.resolve(dir, files[i++]));
    if (isIgnored(fp)) continue;

    var stat = utils.tryStats(fp);
    if (!stat) continue;

    if (stat.isDirectory()) {
      if (fp.indexOf('.git') !== -1) {
        continue;
      }
      res.push.apply(res, tryReaddirs(fp, ignored));
    }
    res.push(fp);
  }
  return res;
};

/**
 * Try to read a directory of files. Silently catches
 * any errors and returns an empty array.
 */

utils.tryStats = function tryStats(fp, verbose) {
  if (typeof fp === 'undefined') {
    throw new Error('utils.tryStats() expects a string.');
  }

  try {
    return fs.statSync(fp);
  } catch (err) {
    if (verbose) console.log(err);
  }
  return null;
};

/**
 * Get the basename of a file path, excluding extension.
 *
 * @param {String} `fp`
 * @param {String} `ext` Optionally pass the extension.
 */

utils.basename = function basename(fp, ext) {
  return fp.substr(0, fp.length - (ext || path.extname(fp)).length);
};

/**
 * Default `renameKey` function.
 */

utils.renameKey = function renameKey(fp, acc, opts) {
  fp = relative.toBase(opts.cwd, fp);
  return utils.basename(fp);
};

/**
 * Get the extension from a string, or the first string
 * in an array (like glob patterns)
 */

utils.getExt = function getExt(str) {
  str = Array.isArray(str) ? str[0] : str;
  return str.slice(str.lastIndexOf('.'));
};

/**
 * Ensure that a file extension is formatted properly.
 *
 * @param {String} `ext`
 */

utils.formatExt = function formatExt(ext) {
  if (ext && ext[0] !== '.') ext = '.' + ext;
  return ext;
};

/**
 * Try to call `fn` on `filepath`, either returning the
 * result when successful, or failing silently and
 * returning null.
 */

utils.tryCatch = function tryCatch(fn, fp) {
  try {
    return fn(path.resolve(fp));
  } catch(err) {}
  return null;
};

/**
 * Try to resolve the given path, or fail silently
 */

utils.tryRequire = function tryRequire(fp) {
  return utils.tryCatch(require, fp);
};

/**
 * Try to resolve the given path, or fail silently
 */

utils.tryResolve = function tryResolve(fp) {
  return utils.tryCatch(require.resolve, fp);
};

/**
 * Try to read a file, or fail silently
 */

utils.tryRead = function tryRead(fp) {
  return utils.tryCatch(utils.readFile, fp);
};

/**
 * Try to read a directory of files. Silently catches
 * any errors and returns an empty array.
 */

utils.tryStat = function tryStat(fp) {
  return utils.tryCatch(fs.statSync, fp);
};

/**
 * Read a file
 */

utils.readFile = function readFile(fp) {
  return fs.readFileSync(fp, 'utf8');
};

/**
 * Write a file
 */

utils.writeFile = function writeFile(fp, str) {
  return fs.writeFileSync(fp, str);
};

/**
 * Creates a matching function to use against
 * the list of given files.
 */

utils.match = function match(files) {
  return function(pattern, options) {
    return mm(files, pattern, options);
  };
};

/**
 * Read a file
 */

utils.tryReadJson = function tryReadJson(fp) {
  try {
    return JSON.parse(utils.readFile(fp));
  } catch(err) {}
  return null;
};

/**
 * Try to read a directory of files. Silently catches
 * any errors and returns an empty array.
 */

utils.tryReaddir = function tryReaddir(fp) {
  try {
    return fs.readdirSync(fp);
  } catch (err) {}
  return [];
};

/**
 * Escape delimiters
 */

utils.escape = function escape(file, next) {
  file.content = file.content.split('{%%').join('__LEFT_DELIM__');
  next();
};

/**
 * Unescape delimiters
 */

utils.unescape = function unescape(file, next) {
  file.content = file.content.split('__LEFT_DELIM__').join('{%');
  next();
};
