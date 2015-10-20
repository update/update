
var utils = require('..');

module.exports = function (config) {
  if (!config || !config.name) {
    throw new Error('expected config.name to be a string.');
  }

  return function (app) {
    var opts = utils.merge({}, config, app.option('store'));
    this.store = utils.store(config.name, opts);
    return this;
  };
};
