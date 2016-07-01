'use strict';

var pkg = require('../../package');

module.exports = function(app) {
  return function(val, key, config, next) {
    app.enable('silent');
    next();
  };
};
