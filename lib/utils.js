'use strict';

var fs = require('fs');
var path = require('path');

/**
 * Pass a file or an array of filepaths that "might" exist,
 * and an object is returned with `ENOENT` and `EXISTS`
 * arrays.
 *
 * @param {Array|String}
 */

exports.exists = function exists(files) {
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

exports.toString = function toString(file) {
  return file.contents.toString();
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

exports.contains = function contains(file, str) {
  return file.path.indexOf(str) !== -1;
};

/**
 * Get a `username/name` github url string.
 *
 * @param  {String} `url`
 * @return {String}
 */

exports.repo = function repo(str) {
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
  if (stat.isFile()) {
    return fp;
  }
  if (fp && fp[fp.length - 1] !== '/') {
    return fp + '/';
  }
  return fp;
};
