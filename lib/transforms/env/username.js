'use strict';

var github = require('parse-github-url');

/**
 * If the `git` transform was not able to find anything,
 * this attempts to generate a username from other fields.
 *
 * Called in the `init` transform.
 */

module.exports = function username_(app) {
  if (!app.get('data.github.username')) {
    var author = app.get('data.author');
    if (typeof author.url === 'string' && /\/github/.test(author.url)) {
      var parsed = github(author.url);
      var user = (parsed && parsed.user) || '';
      if (user) {
        app.set('data.github.username', user);
        app.set('data.username', user);
      }
    }
  }
};
