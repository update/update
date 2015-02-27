'use strict';

var fs = require('fs');
var path = require('path');
var mm = require('micromatch');
var matter = require('gray-matter');
var logger = require('./logging');

/**
 * Read a file
 */

exports.readFile = function readFile(fp) {
  return fs.readFileSync(fp, 'utf8');
};

/**
 * Write a file
 */

exports.writeFile = function writeFile(fp, str) {
  return fs.writeFileSync(fp, str);
};

/**
 * Creates a matching function to use against
 * the list of given files.
 */

exports.match = function match(files) {
  return function(pattern, options) {
    return mm(files, pattern, options);
  };
};

/**
 * Try to read a directory of files. Silently catches
 * any errors and returns an empty array.
 */

exports.tryReaddir = function tryReaddir(fp) {
  try {
    return fs.readdirSync(fp);
  } catch (err) {}
  return [];
};

/**
 * Pass a file or an array of filepaths that "might" exist,
 * and an object is returned with `ENOENT` and `EXISTS`
 * arrays.
 *
 * @param {Array|String}
 */

exports.exists = function exists(files) {
  if (!files) {
    throw new Error('utils.exists() expects an array or string.');
  }

  files = Array.isArray(files) ? files : [files];
  var len = files.length;
  var res = {ENOENT: new Array(len), EXISTS: files.slice()};

  while (len--) {
    var fp = path.resolve(files[len]);
    if (!fs.existsSync(fp)) {
      res.EXISTS.splice(len, 1);
      res.ENOENT[len] = fp;
    }
  }
  return res;
};

/**
 * Stringify the `contents` property of a vinyl file.
 *
 * @param  {Object} `file`
 * @return {String}
 */

exports.replace = function replace(str, a, b) {
  if (typeof str !== 'string' || typeof a !== 'string' || typeof b !== 'string') {
    throw new TypeError('utils.replace() expects a string.');
  }
  return str.split(a).join(b);
};

/**
 * Strip front matter from a string.
 *
 * @param  {String} `fp`
 * @return {String}
 */

exports.antimatter = function antimatter(fp) {
  if (typeof fp !== 'string' ) {
    throw new TypeError('utils.antimatter() expects a string, got:', fp);
  }

  var str = exports.readFile(fp);
  var log = logger(str);
  var obj = matter(str);
  var keys = Object.keys(obj.data);
  if (keys.length) {
    str = obj.content.replace(/^\s+/, '');
    log.success(str, 'stripped deprecated front-matter tags in', fp);
  }
  return str;
};

/**
 * Return true if `file.path` contains the given
 * string. We know if it passes through the stream
 * that the file exists.
 *
 * @param  {Object} `file`
 * @param  {String} `str`
 * @return {Boolean}
 */

exports.contains = function contains(str, ch) {
  if (typeof str !== 'string' ) {
    throw new TypeError('utils.contains() first arg should be a string, not:', str);
  }

  if (typeof ch !== 'string') {
    throw new TypeError('utils.contains() second arg should be a string, not:', ch);
  }
  return str.indexOf(ch) !== -1;
};

/**
 * Get a `username/name` github url string.
 *
 * @param  {String} `url`
 * @return {String}
 */

exports.repo = function repo(str) {
  if (typeof str !== 'string') {
    throw new TypeError('utils.repo() expects a string.');
  }
  return str.replace(/\w+:\/\/github.com\/(.*?)(?:\.git)?$/, '$1');
};

/**
 * Add a trailing slash to a file path.
 *
 * @param  {String} `fp`
 * @param  {Object} `stat`
 * @return {String}
 */

exports.trailingSlash = function trailingSlash(fp, stat) {
  if (typeof fp !== 'string') {
    throw new TypeError('utils.trailingSlash() expects a string.');
  }
  if (stat.isFile()) {
    return fp;
  }
  if (fp && fp[fp.length - 1] !== '/') {
    return fp + '/';
  }
  return fp;
};
