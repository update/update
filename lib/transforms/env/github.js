'use strict';

var parse = require('parse-github-url');

/**
 * Adds a `github` property to the context.
 * Called in the `init` transform.
 */

module.exports = function github_(app) {
  var repo = app.get('data.repository');
  var url = (repo && typeof repo === 'object')
    ? repo.url
    : repo;

  var github = parse(url);
  if (github && Object.keys(github).length) {
    app.data({github: github});
  }
};
