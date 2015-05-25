'use strict';

var render = require('template-render');
var paths = require('gulp-dest-paths');
var init = require('template-init');
var vfs = require('vinyl-fs');
var plugins = require('../../plugins');

/**
 * Enable default plugins.
 */

module.exports = function(app) {
  app.plugin('init', init(app));
  app.plugin('lint', plugins.lint(app));
  app.plugin('paths', paths);
  app.plugin('render', render(app));
  app.plugin('src', vfs.src);
  app.plugin('dest', vfs.dest);

  // default `src` plugins
  app.enable('plugin src');
  app.enable('plugin init');

  // default `plugin dest`s
  app.enable('plugin paths');
  app.enable('plugin lint');
  app.enable('plugin render');
  app.enable('plugin dest');
};
