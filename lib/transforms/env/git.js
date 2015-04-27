'use strict';

var username = require('git-user-name');

/**
 * Called in the `username` transform, if a `username`
 * cannot be determined from easier means, this attempts
 * to get the `user.name` from global `.git config`
 */

module.exports = function username_(app) {
  if (!app.get('data.git.username')) {
    app.set('data.git.username', username());
  }
};
