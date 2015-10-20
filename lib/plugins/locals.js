
var lib = require('..');
var Locals = lib.locals;
var utils = lib.utils;

module.exports = function (config) {
  config = config || {};
  var name = config.name;
  if (!name) {
    throw new Error('expected config.name to be a string.');
  }

  return function (app) {
    var opts = app.option('update') || {};
    opts = utils.merge({}, config, opts);
    this.locals = new Locals(name, this);
    return this;
  };
};
