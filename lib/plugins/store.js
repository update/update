
var lib = require('../');
var utils = lib.utils;

module.exports = function (config) {
  config = config || {};
  var name = config.name;

  return function (app) {
    var opts = app.option('store') || {};
    opts = utils.merge({}, config, opts);
    this.store = utils.store(name, opts);
    return this;
  }
};
