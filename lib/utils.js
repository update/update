'use strict';

var utils = require('lazy-cache')(require);
var fn = require;
require = utils; // eslint-disable-line

/**
 * Utils
 */

require('arr-union', 'union');
require('base-cli-process', 'cli');
require('base-config-process', 'config');
require('base-questions', 'questions');
require('base-runtimes', 'runtimes');
require('base-store', 'store');
require('global-modules', 'gm');
require('log-utils', 'log');
require('os-homedir', 'home');
require = fn; // eslint-disable-line

utils.remove = function(arr, names) {
  return arr.filter(function(ele) {
    return names.indexOf(ele) === -1;
  });
};

/**
 * Return true if any of the given `tasks` are in the specified `list`
 */

utils.contains = function(list, tasks) {
  return utils.arrayify(list).some(function(ele) {
    return ~tasks.indexOf(ele);
  });
};

/**
 * Return true if the given array is empty
 */

utils.isEmpty = function(val) {
  return utils.arrayify(val).length === 0;
};

/**
 * Cast `val` to an array
 */

utils.toArray = function(val) {
  return typeof val === 'string' ? val.split(',') : val;
};

/**
 * Cast `val` to an array
 */

utils.arrayify = function(val) {
  return val ? (Array.isArray(val) ? val : [val]) : [];
};

/**
 * Placeholder logger for updaters
 */

utils.logger = function(prop, color) {
  color = color || 'dim';
  return function(msg) {
    var rest = [].slice.call(arguments, 1);
    return console.log
      .bind(console, utils.log.timestamp, utils.log[prop])
      .apply(console, [utils.log[color](msg), ...rest]);
  }
};

/**
 * Expose utils
 */

module.exports = utils;
