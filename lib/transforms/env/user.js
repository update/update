'use strict';

/**
 * Called in the `init` transform. Adds `user` and `username`
 * for the current project to the context.
 */

module.exports = function user_(app) {
  app.set('data.username', app.get('data.git.username'));
};
