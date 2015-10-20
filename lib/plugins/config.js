'use strict';

var Config = require('map-config');
var lib = require('..');
var utils = lib.utils;

module.exports = function (options) {
  return function (app) {
    var config = app.locals.cache;
    var keys = Object.keys(app.views);
    var views = {};

    keys.forEach(function (key) {
      var instance = app[key];

      views[key] = function (config) {
        var mapper = new Config({
          options: 'option',
          set: 'set',
          addViews: 'addViews'
        }, instance);

        console.log('loading templates from config: "' + key + '"');
        return mapper.process(config);
      };
    });

    var collections = new Config(views);
    var configMap = new Config({
      plugins: function (config) {
        utils.forOwn(config, function (val, key) {
          var opts = utils.merge({}, app.options, val);
          app.use(require(key)(opts));
        });
      },
      collections: function (config) {
        return collections.process(config);
      },
      helpers: 'helpers',
      asyncHelpers: 'asyncHelpers'
    }, app);

    configMap.process(config);
  };
};
