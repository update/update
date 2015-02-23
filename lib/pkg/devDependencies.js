'use strict';

/**
 * Remove the old verb
 */

exports.removeVerb = function(pkg) {
  if (pkg && pkg.devDependencies && pkg.devDependencies['verb-tag-jscomments']) {
    delete pkg.devDependencies['verb-tag-jscomments'];
    delete pkg.devDependencies.verb;
  }
  return pkg;
};

/**
 * Remove `should` when it's not being used
 * in tests.
 */

exports.removeShould = function(pkg) {
  if (pkg && pkg.devDependencies) {
    delete pkg.devDependencies.should;
  }
  return pkg;
};
