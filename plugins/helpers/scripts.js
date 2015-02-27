'use strict';

/**
 * Remove the old verb
 */

exports.fixMocha = function(pkg) {
  if (pkg.scripts && pkg.scripts.test && /mocha --?r/i.test(pkg.scripts.test)) {
    pkg.scripts.test = 'mocha';
  }
  return pkg;
};
