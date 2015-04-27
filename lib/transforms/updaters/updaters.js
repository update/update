'use strict';

var resolveUp = require('resolve-up');
var path = require('path');
var _ = require('lodash');

/**
 * Load updaters onto the `updaters` object
 */

module.exports = function updaters_(app) {
  app.updaters = app.updaters || {};
  var pattern = app.option('updater pattern') || 'updater-*';

  _.transform(resolveUp(pattern), function (acc, dir) {
    var pkg = require(path.resolve(dir, 'package.json'));
    if (!pkg.main) return acc;

    var fp = path.resolve(dir, pkg.main);
    var res = {};
    res.module = require.resolve(path.resolve(fp));
    res.pkg = pkg;
    var name = pkg.name.split('updater-').join('');
    acc[name] = res;
  }, app.updaters);
};
