'use strict';

/**
 * Load templates for built-in template types.
 */

module.exports = function load_(app) {
  app.includes('templates/**/*.*', { cwd: process.cwd()});
  app.dotfiles('templates/**/_*', { cwd: process.cwd()});
};
