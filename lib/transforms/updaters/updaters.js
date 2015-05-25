'use strict';

var glob = require('globby');
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

    res.plugins = plugins(pattern, dir);
    res.updatefile = require.resolve(dir);
    res.module = node_modules(fp);
    res.pkg = pkg;
    var name = pkg.name.split('updater-').join('');
    acc[name] = res;
    return acc;
  }, app.updaters);
};

function node_modules(dir) {
  var fp = path.resolve(path.dirname(dir), 'node_modules/update');
  return require.resolve(fp);
}

function plugins(pattern, dir) {
  var cwd = path.resolve(dir, 'node_modules');
  return glob.sync(pattern, {cwd: cwd}).reduce(function (acc, fp) {
    acc[fp] = require.resolve(path.resolve(cwd, fp));
    return acc;
  }, {});
}
