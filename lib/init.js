'use strict';

var transforms = require('./transforms');
var updaters = transforms.updaters;
var init = transforms.init;
var env = transforms.env;

/**
 * Load initialization transforms
 *
 *  | runner
 *  | loaders
 *  | create
 *  | options
 *  | middleware
 *  | plugins
 *  | load
 *  | engines
 *  | helpers - load helpers last
 */
module.exports = function init_(app) {
  app.transform('updaters', updaters);

  app.transform('metadata', init.metadata);
  app.transform('plugins', init.plugins);
  app.transform('args', init.argv);
  // app.transform('ignore', init.ignore);
  // app.transform('files', env.files);

  app.transform('env', env.env);
  app.transform('pkg', env.pkg);
  app.transform('paths', env.paths);
  app.transform('cwd', env.cwd);
  app.transform('keys', env.keys);
  app.transform('git', env.git);
  app.transform('author', env.author);
  app.transform('user', env.user);
  app.transform('username', env.username);
  app.transform('github', env.github);

  app.on('init', function () {
    app.transform('config', init.config);
    app.transform('runner', init.runner);
    app.transform('defaults', init.defaults);
    app.transform('loaders', init.loaders);
    app.transform('create', init.create);
    app.transform('engines', init.engines);
    app.transform('middleware', init.middleware);
    app.transform('helpers', init.helpers);
    app.transform('load', init.load);
    app.emit('loaded');
  });

  app.on('loaded', function () {
    app.transform('helpers', init.helpers);
  });
};
