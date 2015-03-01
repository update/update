'use strict';

var chalk = require('chalk');
var symbol = require('log-symbols');
var merge = require('merge-deep');

module.exports = function (str, options) {
  if (typeof str === 'object') {
    options = str;
  }

  options = merge({}, options);
  var log = {};

  log.success = function (updated, msg, fp) {
    if (options.nocompare || updated !== str) {
      var text = chalk.gray(msg.trim()) + (fp ? (' ' + fp) : '');
      console.log('  ' + symbol.success + '  ' + text);
    }
  };

  log.results = log.success;

  log.info = function (msg, fp) {
    var text = chalk.gray(msg.trim()) + (fp ? (' ' + fp) : '');
    console.log('  ' + symbol.info + '  ' + text);
  };

  log.deleted = function (msg, fp) {
    var text = chalk.gray(msg.trim()) + (fp ? (' ' + fp) : '');
    console.log('  ' + symbol.success + '  ' + text);
  };

  return log;
};
