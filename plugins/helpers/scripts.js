'use strict';

var sortObj = require('sort-object');
var diff = require('arr-diff');
var keys = require('./keys');

/**
 * Remove the old verb
 */

exports.fixMocha = function(pkg) {
  var keys = diff(Object.keys(pkg), keys);
  var res = sortObj(pkg, keys.concat(keys));
  if (res.scripts && res.scripts.test && /mocha -r/i.test(res.scripts.test)) {
    res.scripts.test = 'mocha';
  }
  return res;
};
