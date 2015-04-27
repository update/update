'use strict';

/**
 * Load built-in templates
 */

module.exports = function load_(app) {
  app.includes('templates/**/*.*', { cwd: process.cwd()});
  app.dotfiles('templates/**/_*', { cwd: process.cwd()});
};
