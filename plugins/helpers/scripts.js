'use strict';

var debug = require('debug')('update:helpers');

/**
 * Remove the old verb
 */

exports.fixMocha = function(pkg) {
  debug('helpers:fixMocha %j', pkg);
  if (pkg.scripts && pkg.scripts.test && /mocha --?r/i.test(pkg.scripts.test)) {
    pkg.scripts.test = 'mocha';
  }
  return pkg;
};
