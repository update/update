'use strict';

var init = require('./transforms/');

/**
 * Load initialization transforms
 *
 *  | config
 *  | loaders
 *  | templates
 *  | options
 *  | middleware
 *  | plugins
 *  | load
 *  | engines
 *  | helpers
 */

module.exports = function(app) {
  app.transform('metadata', init.metadata);
  app.transform('plugins', init.plugins);

  app.once('loaded', function () {
    app.transform('cwd', init.cwd);
    app.transform('paths', init.paths);
    app.emit('env');
  });

  app.once('env', function () {
    app.transform('options', init.options);
    app.transform('runner', init.runner);
    app.transform('argv', init.argv);
    app.transform('config', init.config);
    app.transform('loaders', init.loaders);
    app.transform('create', init.create);
    app.transform('engines', init.engines);
    app.transform('middleware', init.middleware);
    app.transform('helpers', init.helpers);
    app.transform('load', init.load);
    app.emit('init');
  });

  app.once('init', function () {
    app.transform('helpers', init.helpers);
    app.emit('last');
  });
};
